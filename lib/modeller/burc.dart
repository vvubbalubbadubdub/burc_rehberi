class Burc {
  String _burcAdi;
  String _burcTarihi;
  String _burcAciklamasi;
  String _burcKR;
  String _burcBR;

  String get burcAdi => _burcAdi;

  set burcAdi(String newBurcAdi) {
    _burcAdi = newBurcAdi;
  }

  String get burcTarihi => _burcTarihi;

  set burcTarihi(String newBurcTarihi) {
    _burcTarihi = newBurcTarihi;
  }

  String get burcAciklamasi => _burcAciklamasi;

  set burcAciklamasi(String newBurcAciklamasi) {
    _burcAciklamasi = newBurcAciklamasi;
  }

  String get burcKR => _burcKR;

  set burcKR(String newBurcKR) {
    _burcKR = newBurcKR;
  }

  String get burcBR => _burcBR;

  set burcBR(String newBurcBR) {
    _burcBR = newBurcBR;
  }

  Burc(
    this._burcAdi,
    this._burcTarihi,
    this._burcAciklamasi,
    this._burcKR,
    this._burcBR,
  );
}
