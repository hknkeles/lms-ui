export default function AssignmentsPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Ödevler</h2>
        <p className="text-gray-600">
          Tüm ödevlerin ve teslim tarihleri.
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-pastel-blue-light rounded-lg border-l-4 border-primary-500">
            <div>
              <h3 className="font-semibold text-gray-900">Matematik Final Projesi</h3>
              <p className="text-sm text-gray-600">Matematik 101 - Prof. Dr. Ahmet Yılmaz</p>
              <p className="text-xs text-gray-500 mt-1">Teslim: 15 Aralık 2024</p>
            </div>
            <span className="px-3 py-1 bg-primary-100 text-primary-800 text-sm font-medium rounded-full">
              Aktif
            </span>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
            <div>
              <h3 className="font-semibold text-gray-900">İngilizce Essay</h3>
              <p className="text-sm text-gray-600">İngilizce Kompozisyon - Dr. Sarah Johnson</p>
              <p className="text-xs text-gray-500 mt-1">Teslim: 20 Aralık 2024</p>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
              Aktif
            </span>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border-l-4 border-gray-400">
            <div>
              <h3 className="font-semibold text-gray-900">Programlama Ödevi</h3>
              <p className="text-sm text-gray-600">Bilgisayar Programlama - Prof. Dr. Mehmet Kaya</p>
              <p className="text-xs text-gray-500 mt-1">Teslim: 10 Aralık 2024</p>
            </div>
            <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm font-medium rounded-full">
              Tamamlandı
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
