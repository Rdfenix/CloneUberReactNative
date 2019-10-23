import React, {Component} from 'react';
import {
  Container,
  TypeTitle,
  TypeDescription,
  TypeImage,
  RequestButton,
  RequestButtonText,
} from './styles';

import uberX from '../../assets/uberx.png';

class Details extends Component {
  render() {
    return (
      <Container>
        <TypeTitle>Popular</TypeTitle>
        <TypeDescription>Viagens baratas para o dia a dia</TypeDescription>

        <TypeImage source={uberX} />
        <TypeTitle>UberX</TypeTitle>
        <TypeDescription>R$ 6,00</TypeDescription>

        <RequestButton onPress={() => {}}>
          <RequestButtonText>Solicitar UBERX</RequestButtonText>
        </RequestButton>
      </Container>
    );
  }
}

export default Details;
