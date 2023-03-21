import ProductCard from '../product-card/product-card.component';

import {
    ProductsPreviewContainer,
    Title,
    Preview,
} from './products.styles';

interface ProductsPreviewProps {
    title: string;
    products: [] | undefined
}

const ProductsPreview = ({ title, products }: ProductsPreviewProps) => {
    return (
        <ProductsPreviewContainer>
            <h2>
                <Title to={''}>{title}</Title>
            </h2>
            <Preview>
                {products && products.map((product: any) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </Preview>
        </ProductsPreviewContainer>
    );
};

export default ProductsPreview;