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
                <Title to={title}>{title}</Title>
            </h2>
            <Preview>
                {products && products.filter((_: any, idx: number) => idx < 4)
                    .map((product: any) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
            </Preview>
        </ProductsPreviewContainer>
    );
};

export default ProductsPreview;