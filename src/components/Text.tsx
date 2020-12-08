import styled from 'styled-components';
import theme from '../theme';

type TextProps = {
  children: React.ReactNode;
  variation?: Variations;
};

type Variations = 'primary' | 'disabled' | 'danger';

const Text = styled.p<TextProps>`
  color: ${(props) => theme.variants[props.variation || 'default']};
`;

export { Text };