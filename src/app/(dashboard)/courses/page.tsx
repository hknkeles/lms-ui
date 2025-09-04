export default function CoursesPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Derslerim</h2>
        <p className="text-gray-600">
          Bu dönem kayıtlı olduğun dersler ve ilerleme durumun.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Matematik 101</h3>
          <p className="text-sm text-gray-600 mb-4">Prof. Dr. Ahmet Yılmaz</p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>İlerleme:</span>
              <span className="font-medium text-primary-600">75%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-primary-500 h-2 rounded-full" style={{ width: '75%' }}></div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">İngilizce Kompozisyon</h3>
          <p className="text-sm text-gray-600 mb-4">Dr. Sarah Johnson</p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>İlerleme:</span>
              <span className="font-medium text-primary-600">60%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-primary-500 h-2 rounded-full" style={{ width: '60%' }}></div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Bilgisayar Programlama</h3>
          <p className="text-sm text-gray-600 mb-4">Prof. Dr. Mehmet Kaya</p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>İlerleme:</span>
              <span className="font-medium text-primary-600">90%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-primary-500 h-2 rounded-full" style={{ width: '90%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
