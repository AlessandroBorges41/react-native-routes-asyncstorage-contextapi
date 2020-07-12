import React, { useState, useMemo } from 'react';

import { useNavigation } from '@react-navigation/native';

import FeatherIcon from 'react-native-vector-icons/Feather';
import {
  Container,
  CartPricing,
  CartButton,
  CartButtonText,
  CartTotalPrice,
} from './styles';

import formatValue from '../../utils/formatValue';

import { useCart } from '../../hooks/cart';

// Calculo do total
// Navegação no clique do TouchableHighlight

const FloatingCart: React.FC = () => {
  const { products } = useCart();

  const navigation = useNavigation();

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

    /* Retorna o valor que foi obtido do reduce() */
    return totalProduct;
  }, [products]);

  return (
    <Container>
      <CartButton
        testID="navigate-to-cart-button"
        onPress={() => navigation.navigate('Cart')}
      >
        <FeatherIcon name="shopping-cart" size={24} color="#fff" />
        <CartButtonText>{`${totalItensInCart} itens`}</CartButtonText>
      </CartButton>

      <CartPricing>
        <CartTotalPrice>{cartTotal}</CartTotalPrice>
      </CartPricing>
    </Container>
  );
};

export default FloatingCart;
