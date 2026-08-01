import FilterSideBar from '@/components/FilterSideBar'
import ProductCard from '@/components/ProductCard'
import FilterSideBarSkeleton from '@/components/skeletonScreen/FilterSideBarSkeleton';
import ProductCardSkeleton from '@/components/skeletonScreen/ProductCardSkeleton';
import { setProducts } from '@/redux/productSlices';
import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

const Product = () => {

    const selector = useSelector((store) => store.products);

    const [loading, setLoading] = useState(false)
    const [showProduct, setShowProduct] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedBrand, setSelectedBrand] = useState("All");
    const [priceRange, setPriceRange] = useState([0, 999999]);
    const [sortOrder, setSortOrder] = useState("");

    const dispatch = useDispatch();

    const getProduct = async () => {
        try {
            setLoading(true);

            const response = await axios.get('https://mern-ecommerce-app-n6us.onrender.com/api/v1/product/allProducts');
            if (response.data.success) {
                setShowProduct(response.data.allProduct);
                dispatch(setProducts(response.data.allProduct));
            }

            console.log(response.data)

        } catch (error) {
            console.log("Error fetching products:", error);
            toast.error(error.response.data.message);
        }
        finally {
            setLoading(false);
        }

    }

    
        let filtered = [...showProduct];

        if (search.trim() !== "") {
            filtered = filtered.filter((p) => p.productName?.toLowerCase().includes(search.toLowerCase()));
        }

        if (selectedCategory !== "All") {
            filtered = filtered.filter((p) => p.category === selectedCategory);
        }

        if (selectedBrand !== "All") {
            filtered = filtered.filter((p) => p.brand === selectedBrand);
        }

        filtered = filtered.filter((p) => p.productPrice >= priceRange[0] && p.productPrice <= priceRange[1]);

        if (sortOrder === "LowToHigh") {
            filtered = filtered.sort((a, b) => a.productPrice - b.productPrice);
        }
        else if (sortOrder === "HighToLow") {
            filtered = filtered.sort((a, b) => b.productPrice - a.productPrice);
        }

        

    useEffect(() => {
        getProduct();
    }, []);


    return (
        <div className="max-w-350 mx-auto p-8">
            <div className="flex justify-end mb-6">
                <select className="border min-w-50 border-gray-200 rounded-md px-4 py-2 text-sm text-gray-600 bg-white focus:outline-none cursor-pointer hover:border-gray-300" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                    <option value="">Sort by Price</option>
                    <option value="LowToHigh">Low to High</option>
                    <option value="HighToLow">High to Low</option>
                </select>
            </div>
            <div className="flex gap-10 items-start">
                <div className="">
                    {
                        loading ? <FilterSideBarSkeleton /> :
                            <FilterSideBar
                                allProduct={showProduct}
                                search={search} setSearch={setSearch}
                                selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}
                                selectedBrand={selectedBrand} setSelectedBrand={setSelectedBrand}
                                priceRange={priceRange} setPriceRange={setPriceRange} />
                    }

                </div>
                <div className="flex-1 gap-y-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {
                        loading ? Array.from({ length: 8 }).map((_, index) => (<ProductCardSkeleton key={index} />)) :
                            filtered.map((product) => {
                                return <ProductCard key={product._id} product={product} />
                            })
                    }
                </div>

            </div>
        </div>
    )
}

export default Product