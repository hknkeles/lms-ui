export default function GradesPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Notlar</h2>
        <p className="text-gray-600">
          Tüm derslerindeki notların ve genel ortalaman.
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Genel Ortalama</h3>
          <div className="text-3xl font-bold text-primary-600">85.2</div>
          <p className="text-sm text-gray-500">Bu dönem</p>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-pastel-blue-light rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Matematik 101</h4>
              <p className="text-sm text-gray-600">Prof. Dr. Ahmet Yılmaz</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary-600">88</div>
              <div className="text-sm text-gray-500">A</div>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-pastel-blue-light rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">İngilizce Kompozisyon</h4>
              <p className="text-sm text-gray-600">Dr. Sarah Johnson</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary-600">82</div>
              <div className="text-sm text-gray-500">B+</div>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-pastel-blue-light rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Bilgisayar Programlama</h4>
              <p className="text-sm text-gray-600">Prof. Dr. Mehmet Kaya</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary-600">91</div>
              <div className="text-sm text-gray-500">A+</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
