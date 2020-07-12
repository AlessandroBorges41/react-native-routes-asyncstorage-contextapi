import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Omit<Product, 'quantity'>): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      /* Recuperando os produtos do AsyncStorage  */
      const repositorioProducts = await AsyncStorage.getItem('@GoMarketPlace:products');

      /* Caso tenha obtido resultado no getItem executa e popula o setInmediate */
      if(repositorioProducts){
        /* Executa um Spread operation no Array de produtos */
        setProducts([...JSON.parse(repositorioProducts)]);
      }


    }

    loadProducts();
  }, []);

  const addToCart = useCallback(async product => {

    /* Localizando o produto para saber se já existe no carrinho */
    const productExists = products.find(prod => prod.id === product.id);

    /* Se o produto existir será incrementado a sua quantidade dentro do carrinho */
    if(productExists){
      /* Utilizando map() para mapear todos os produtos no array de produtos, sendo que será localizado o produto por seu id.
        Encontrado o produto será utilizado o Spread Operation para pegar todas as propriedades do produto a ser realizado a
        adição de um item a mais na sua quantidade, caso não encontre o produto será retornado apenas o produto.
      */
      setProducts(
          products.map(prod =>
            prod.id === product.id ? {...product, quantity: prod.quantity + 1 } : prod ),
      );
    } else {
      /* Caso não exista o produto será utilizado na primeira parte um Spread Operation para pegar todos os produtos do array(products)
         para manté-los no array e no segundo Spread Operation será obtido o produto e suas propriedade que foi passado no objeto(product) de
         produtos recebido como parametros.
      */
        setProducts([...products,{...product, quantity: 1}]);
    }
    await AsyncStorage.setItem(
      '@GoMarketPlace:products',
      JSON.stringify(products),
    )

  }, [products]);

  const increment = useCallback(async id => {
    /* Recebe a chamada de Pages > Cart > index.tsx e passa o ID */
    /* Será realizado um map() do array de produtos (products) e realizado o teste a procura do produto com seu
       Id informado, sendo localizado será realizado o incremento da quantidade, caso não seja encontra será retodado o produto
       apenas
    */

      const newProducts = products.map(
        product => product.id === id
        ? {...product, quantity: product.quantity + 1}
        : product,
      );

      setProducts(newProducts);
      /* Armazenando(salva) os valores do carrinho no AsyncStorage */
      await AsyncStorage.setItem(
        '@GoMarketPlace:products',
        JSON.stringify(newProducts),
      )

  }, [products]);

  const decrement = useCallback(async id => {
    /* Recebe a chamada de Pages > Cart > index.tsx e passa o ID */
    /* Será realizado um map() do array de produtos (products) e realizado o teste a procura do produto com seu
       Id informado, sendo localizado será realizado o decremento da quantidade.
       apenas
    */
    const removeProducts =  products.map(
      product => product.id === id
      ? {...product, quantity: product.quantity - 1}
      : product,
    );

    setProducts(removeProducts);
     /* Armazenando(salva) os valores do carrinho no AsyncStorage */
     await AsyncStorage.setItem(
      '@GoMarketPlace:products',
      JSON.stringify(removeProducts),
    )


   /* A dependência do [products] é muito importante, pois é usado como atualização e reutilizado */
  }, [products]);

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
