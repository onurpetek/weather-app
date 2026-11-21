const API_URL = "https://api.openweathermap.org/data/2.5/weather";

const aramaFormu = document.getElementById("arama-formu");
const sehirInput = document.getElementById("sehir");
const hataMesaji = document.getElementById("hata-mesaji");

async function havaDurumuGetir(sehir) {
  const url = `${API_URL}?q=${encodeURIComponent(sehir)}&appid=${API_KEY}&units=metric&lang=tr`;

  const cevap = await fetch(url);

  if (!cevap.ok) {
    if (cevap.status === 404) {
      throw new Error("Şehir bulunamadı. Adı doğru yazdığınızdan emin olun.");
    }
    if (cevap.status === 401) {
      throw new Error("API anahtarı geçersiz ya da henüz aktif değil.");
    }
    throw new Error("Veri alınamadı. Lütfen daha sonra tekrar deneyin.");
  }

  return await cevap.json();
}


function kartiGuncelle(veri) {
  const aciklama = veri.weather[0].description;

  document.getElementById("sehir-adi").textContent = veri.name;
  document.getElementById("sicaklik").textContent = Math.round(veri.main.temp) + " °C";
  document.getElementById("aciklama").textContent =
    aciklama.charAt(0).toUpperCase() + aciklama.slice(1);
  document.getElementById("nem").textContent = "Nem: " + veri.main.humidity + "%";
  document.getElementById("ruzgar").textContent = "Rüzgar: " + veri.wind.speed + " m/s";
}

function hataGoster(mesaj) {
  hataMesaji.textContent = mesaj;
  hataMesaji.hidden = false;
}

function hataTemizle() {
  hataMesaji.textContent = "";
  hataMesaji.hidden = true;
}

if (aramaFormu) {
  aramaFormu.addEventListener("submit", async function (olay) {
    olay.preventDefault();

    const sehir = sehirInput.value.trim();

    if (sehir === "") {
      hataGoster("Lütfen bir şehir adı yazın.");
      return;
    }

    hataTemizle();
    document.getElementById("aciklama").textContent = "Yükleniyor...";

    try {
      const veri = await havaDurumuGetir(sehir);
      kartiGuncelle(veri);
    } catch (hata) {
      if (hata instanceof TypeError) {
        hataGoster("İnternet bağlantınızı kontrol edin.");
      } else {
        hataGoster(hata.message);
      }
      document.getElementById("aciklama").textContent = "--";
    }
  });
}
