import React, { useMemo } from 'react';
import FeatherIcon from 'react-native-vector-icons/Feather';

import { View } from 'react-native';

import {
  Container,
  ProductContainer,
  ProductList,
  Product,
  ProductImage,
  ProductTitleContainer,
  ProductTitle,
  ProductPriceContainer,
  ProductSinglePrice,
  TotalContainer,
  ProductPrice,
  ProductQuantity,
  ActionContainer,
  ActionButton,
  TotalProductsContainer,
  TotalProductsText,
  SubtotalValue,
} from './styles';

import { useCart } from '../../hooks/cart';

import formatValue from '../../utils/formatValue';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

const Cart: React.FC = () => {
  const { increment, decrement, products } = useCart();

  function handleIncrement(id: string): void {
    /* Passando para a função increment o valor do id */
    increment(id);
  }

  function handleDecrement(id: string): void {
    /* Passando para a função decrement o valor do id */
    decrement(id);
  }

  const cartTotal = useMemo(() => {
    /* Sumarizando os valores dos itens existentes no carrinho usando reduce() e iniciando seu valor em zero */
    const totalProduct = products.reduce((accumulator, product) => {
      /* Obtem o valor do produto e multiplica por sua quantidade */
      const productSubTotal = product.price * product.quantity;

      /* Retorna a soma dos subtotais obtido de cada produto somando ao sumarizador */
      return accumulator + productSubTotal;
    }, 0);

    return formatValue(totalProduct);
  }, [products]);

  const totalItensInCart = useMemo(() => {
    /* Sumarizando os valores dos itens existentes no carrinho usando reduce() e iniciando seu valor em zero */
    const totalProduct = products.reduce((accumulator, product) => {
      /* Obtem a quantidade de produtos*/
      const productQuant = product.quantity;

      /* Retorna a soma dos subtotais obtido de cada produto somando ao sumarizador */
      return accumulator + productQuant;
    }, 0);

    return totalProduct;
  }, [products]);

  return (
    <Container>
      <ProductContainer>
        <ProductList
          data={products}
          keyExtractor={item => item.id}
          ListFooterComponent={<View />}
          ListFooterComponentStyle={{
            height: 80,
          }}
          renderItem={({ item }: { item: Product }) => (
            <Product>
              <ProductImage source={{ uri: item.image_url }} />
              <ProductTitleContainer>
                <ProductTitle>{item.title}</ProductTitle>
                <ProductPriceContainer>
                  <ProductSinglePrice>
                    {formatValue(item.price)}
                  </ProductSinglePrice>

                  <TotalContainer>
                    <ProductQuantity>{`${item.quantity}x`}</ProductQuantity>

                    <ProductPrice>
                      {formatValue(item.price * item.quantity)}
                    </ProductPrice>
                  </TotalContainer>
                </ProductPriceContainer>
              </ProductTitleContainer>
              <ActionContainer>
                <ActionButton
                  testID={`increment-${item.id}`}
                  onPress={() => handleIncrement(item.id)}
                >
                  <FeatherIcon name="plus" color="#E83F5B" size={16} />
                </ActionButton>
                <ActionButton
                  testID={`decrement-${item.id}`}
                  onPress={() => handleDecrement(item.id)}
                >
                  <FeatherIcon name="minus" color="#E83F5B" size={16} />
                </ActionButton>
              </ActionContainer>
            </Product>
          )}
        />
      </ProductContainer>
      <TotalProductsContainer>
        <FeatherIcon name="shopping-cart" color="#fff" size={24} />
        <TotalProductsText>{`${totalItensInCart} itens`}</TotalProductsText>
        <SubtotalValue>{cartTotal}</SubtotalValue>
      </TotalProductsContainer>
    </Container>
  );
};

export default Cart;
