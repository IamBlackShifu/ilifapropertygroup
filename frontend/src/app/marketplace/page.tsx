'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { suppliersAPI } from '@/lib/api-client';

const PRODUCT_CATEGORIES = [
  'ALL', 'CEMENT', 'BRICKS', 'STEEL', 'ROOFING', 'PLUMBING',
  'ELECTRICAL', 'PAINT', 'TILES', 'DOORS', 'WINDOWS',
  'HARDWARE', 'TOOLS', 'OTHER'
];

const ZIMBABWE_CITIES = [
  'All Cities', 'Harare', 'Bulawayo', 'Chitungwiza', 'Mutare', 'Gweru',
  'Kwekwe', 'Kadoma', 'Masvingo', 'Chinhoyi', 'Norton'
];

export default function SuppliersMarketplacePage() {
  const [loading, setLoading] = useState(true);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [view, setView] = useState<'suppliers' | 'products'>('suppliers');
  const [error, setError] = useState('');

  // Filters
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [cityFilter, setCityFilter] = useState('All Cities');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [suppliersRes, productsRes] = await Promise.all([
        suppliersAPI.getAllSuppliers(),
        suppliersAPI.searchProducts({})
      ]);
      
      setSuppliers(suppliersRes.data || []);
      setProducts(productsRes.data || []);
    } catch (err: any) {
      setError('Failed to load marketplace data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      if (view === 'suppliers') {
        const params: any = {};
        if (categoryFilter !== 'ALL') params.category = categoryFilter;
        if (cityFilter !== 'All Cities') params.city = cityFilter;
        if (verifiedOnly) params.isVerified = true;
        if (searchTerm) params.search = searchTerm;

        const response = await suppliersAPI.getAllSuppliers(params);
        setSuppliers(response.data || []);
      } else {
        const params: any = {};
        if (categoryFilter !== 'ALL') params.category = categoryFilter;
        if (cityFilter !== 'All Cities') params.city = cityFilter;
        if (searchTerm) params.search = searchTerm;
        if (priceRange.min) params.minPrice = parseFloat(priceRange.min);
        if (priceRange.max) params.maxPrice = parseFloat(priceRange.max);

        const response = await suppliersAPI.searchProducts(params);
        setProducts(response.data || []);
      }
    } catch (err) {
      setError('Search failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [view, categoryFilter, cityFilter, verifiedOnly]);

  if (loading && suppliers.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-primary-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold">Building Materials Marketplace</h1>
          <p className="text-xl text-primary-100">
            Find verified suppliers and quality building materials across Zimbabwe
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* View Toggle */}
        <div className="mb-6 flex justify-center">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              onClick={() => setView('suppliers')}
              className={`px-6 py-3 text-sm font-medium rounded-l-lg border ${
                view === 'suppliers'
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              Browse Suppliers
            </button>
            <button
              onClick={() => setView('products')}
              className={`px-6 py-3 text-sm font-medium rounded-r-lg border-t border-r border-b ${
                view === 'products'
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              Browse Products
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <input
                type="text"
                placeholder={`Search ${view}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Category */}
            <div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                {PRODUCT_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* City */}
            <div>
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                {ZIMBABWE_CITIES.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {view === 'suppliers' && (
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">Verified suppliers only</span>
              </label>
            )}

            {view === 'products' && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">Price range:</span>
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                  className="w-24 border border-gray-300 rounded-md py-1 px-2 text-sm"
                />
                <span className="text-gray-500">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                  className="w-24 border border-gray-300 rounded-md py-1 px-2 text-sm"
                />
              </div>
            )}

            <button
              onClick={handleSearch}
              className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 text-sm font-medium"
            >
              Search
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Results */}
        {view === 'suppliers' ? (
          <div>
            <div className="mb-4 text-sm text-gray-600">
              {suppliers.length} supplier{suppliers.length !== 1 ? 's' : ''} found
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {suppliers.map((supplier) => (
                <div key={supplier.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900">{supplier.companyName}</h3>
                        {supplier.isVerified && (
                          <span className="inline-flex items-center text-xs text-green-600 mt-1">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Verified
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="flex items-center text-yellow-400">
                          <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                          </svg>
                          <span className="ml-1 text-sm font-medium text-gray-900">
                            {supplier.rating ? Number(supplier.rating).toFixed(1) : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {supplier.description}
                    </p>

                    <div className="space-y-2 mb-4 text-sm">
                      <div className="flex items-center text-gray-600">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {supplier.city}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {supplier.categories.slice(0, 3).map((cat: string) => (
                          <span key={cat} className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded">
                            {cat}
                          </span>
                        ))}
                        {supplier.categories.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            +{supplier.categories.length - 3}
                          </span>
                        )}
                      </div>
                    </div>

                    <Link
                      href={`/suppliers/${supplier.id}`}
                      className="block w-full text-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-4 text-sm text-gray-600">
              {products.length} product{products.length !== 1 ? 's' : ''} found
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                  <div className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-t-lg overflow-hidden">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-48 bg-gray-100">
                        <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold text-primary-600">
                        ${Number(product.price).toFixed(2)}
                      </span>
                      <span className="text-xs text-gray-500">
                        per {product.unit}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mb-3">
                      by {product.supplier?.companyName}
                    </div>
                    <Link
                      href={`/products/${product.id}`}
                      className="block w-full text-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 text-sm"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {((view === 'suppliers' && suppliers.length === 0) || (view === 'products' && products.length === 0)) && !loading && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No results found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
