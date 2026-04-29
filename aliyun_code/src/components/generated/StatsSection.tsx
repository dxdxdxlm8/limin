const stats = [
  {
    value: '25+',
    label: '年行业经验',
    labelEn: 'Years of Experience',
  },
  {
    value: '50+',
    label: '全球合作品牌',
    labelEn: 'Global Brands',
  },
  {
    value: '10000+',
    label: '服务客户',
    labelEn: 'Satisfied Customers',
  },
  {
    value: '500+',
    label: '成功案例',
    labelEn: 'Success Stories',
  },
];

export function StatsSection() {
  return (
    <section className="py-20 bg-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-[#C9A961] mb-2">
                {stat.value}
              </div>
              <div className="text-gray-400 text-sm md:text-base">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
