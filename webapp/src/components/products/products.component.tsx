import ProductCard from '../product-card/product-card.component';
import { Product } from '../../contexts/products.context';

import {
    ProductsPreviewContainer,
    Title,
    Preview,
} from './products.styles';

interface ProductsPreviewProps {
    title: string;
    products: Product[] | undefined
}

const ProductsPreview = ({ title, products }: ProductsPreviewProps) => {
    return (
        <ProductsPreviewContainer>
            <h2>
                <Title to={''}>{title}</Title>
            </h2>
            <Preview>
                {products && products.map((product: Product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </Preview>
        </ProductsPreviewContainer>
    );
};

export default ProductsPreview;