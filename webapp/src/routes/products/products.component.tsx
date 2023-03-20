import { useContext } from 'react';
import ProductsPreview from '../../components/products/products.component';
import { ProductsContext } from '../../contexts/products.context';

const Products = () => {
    const { currentProducts: currentProducts } = useContext(ProductsContext);
    return (
        <div>
            <ProductsPreview key="Products" title="Products" products={currentProducts}/>
        </div>
    );
}

export default Products;