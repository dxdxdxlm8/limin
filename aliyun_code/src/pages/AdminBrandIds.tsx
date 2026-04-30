import { useState, useEffect } from 'react';
import { PageMeta } from '@/components/common/PageMeta';
import { getBrands, type BrandInfo } from '@/lib/queries';

export default function AdminBrandIds() {
  const [brands, setBrands] = useState<BrandInfo[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      const data = await getBrands();
      setBrands(data);
    }
    fetchData();
  }, []);

  const handleCopy = (id: string, _brandName: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <>
      <PageMeta title="品牌 ID 管理 - 管理员专用" />
      <main className="min-h-screen bg-gray-100 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">品牌 ID 管理</h1>
            <p className="text-sm text-gray-600">管理员专用 - 用于产品管理中的品牌关联</p>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">品牌名称</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">英文名称</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">国家</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">品牌 ID (UUID)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {brands.map((brand) => (
                  <tr key={brand.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{brand.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{brand.name_en}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{brand.country}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{brand.slug}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <code className="text-xs font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded block max-w-xs truncate" title={brand.id}>
                        {brand.id}
                      </code>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleCopy(brand.id, brand.name)}
                        className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                          copiedId === brand.id
                            ? 'bg-green-100 text-green-700'
                            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                        }`}
                      >
                        {copiedId === brand.id ? '已复制' : '复制 ID'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-900 mb-2">使用说明：</h3>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>在管理后台进入「内容管理 → 产品管理」</li>
              <li>编辑或添加产品</li>
              <li>在此页面复制对应品牌的 ID（UUID 格式）</li>
              <li>粘贴到产品编辑页面的"所属品牌"字段</li>
              <li>保存产品后，前端品牌详情页会自动显示该产品</li>
            </ol>
          </div>
        </div>
      </main>
    </>
  );
}
