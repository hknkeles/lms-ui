export default function MessagesPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Mesajlar</h2>
        <p className="text-gray-600">
          Öğretmenlerin ve sınıf arkadaşlarınla olan mesajlaşmaların.
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-4 bg-pastel-blue-light rounded-lg border-l-4 border-primary-500">
            <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-medium text-sm">AY</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">Prof. Dr. Ahmet Yılmaz</h4>
                <span className="text-xs text-gray-500">2 saat önce</span>
              </div>
              <p className="text-sm text-gray-700 mb-2">
                Merhaba Merve, final projeni inceledim. Çok güzel bir çalışma olmuş. Sadece birkaç küçük düzeltme yapman gerekiyor.
              </p>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-primary-500 text-white text-xs rounded-md hover:bg-primary-600">
                  Yanıtla
                </button>
                <button className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded-md hover:bg-gray-300">
                  Görüntüle
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-medium text-sm">SJ</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">Dr. Sarah Johnson</h4>
                <span className="text-xs text-gray-500">1 gün önce</span>
              </div>
              <p className="text-sm text-gray-700 mb-2">
                Essay'ini aldım. Çok iyi yazılmış! Sadece birkaç gramer hatası var, onları düzeltebilirsin.
              </p>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-green-500 text-white text-xs rounded-md hover:bg-green-600">
                  Yanıtla
                </button>
                <button className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded-md hover:bg-gray-300">
                  Görüntüle
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border-l-4 border-gray-400">
            <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-medium text-sm">MK</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">Prof. Dr. Mehmet Kaya</h4>
                <span className="text-xs text-gray-500">3 gün önce</span>
              </div>
              <p className="text-sm text-gray-700 mb-2">
                Programlama ödevini başarıyla tamamladın. Tebrikler! Kod kaliten çok yüksek.
              </p>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-gray-500 text-white text-xs rounded-md hover:bg-gray-600">
                  Yanıtla
                </button>
                <button className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded-md hover:bg-gray-300">
                  Görüntüle
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
