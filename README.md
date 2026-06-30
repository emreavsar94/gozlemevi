# 🌌 Gözlemevi — Orrery Orbit & Phase Simulation

Gözlemevi; Güneş Sistemi'ndeki gezegenlerin, asteroit kuşaklarının ve Ay'ın yörünge mekaniklerini, Dünyadan bakış evrelerini (Phase Shading) ve anlık ufuk çizgisindeki görünürlüklerini (Sky Map) gerçek zamanlı hesaplayan üst düzey bir **Progressive Web Application (PWA)** uzay simülasyonudur.

Ağır matematiksel yükleri tarayıcının işlemcisini (CPU) kilitlemeden, tamamen ekran kartı (GPU) donanım ivmesi ve hücresel bileşen izolasyon hatları ile çözümler.

🔗 **Canlı Simülasyonu Deneyimleyin:** [https://gozlemevi.pages.dev/](https://gozlemevi.pages.dev/)

---

## ⚡ Donanım ve Performans Mühendisliği (60 FPS)

Ekranda aynı anda yüzlerce asteroiti, drifting yıldız katmanlarını ve hareketli gök cisimlerini tarayıcıyı tekletmeden koşturmak akıllıca bir optimizasyon mimarisi gerektirir:

* **🧩 Hücresel İzolasyon Sınırları (`Component Memoization`):** Zaman akarken arka plandaki 500 asteroit kuşağının ve derin uzay yıldızlarının gereksiz yere re-render edilmesini engellemek için statik görsel yapılar `React.memo` sınırları ile tamamen dondurulmuştur. Dönüş yükü doğrudan GPU'da işlenir.
* **🍃 Sıfır Hafıza Yörünge İzleri (`Zero-Leak Orbit Trails`):** Gezegenlerin arkasında sönümlenerek akan o havalı yörünge kuyruk izlerini çizmek için geçmiş koordinatları bir JavaScript dizisinde (`Array`) tutup RAM'de biriktirmek yerine, eliptik yollar üzerine açıyla birlikte dönen sönümlü bir `linearGradient` maske giydirilmiştir. RAM yükü: 0 bayttır.
* **📐 Vektörel Mercek Keskinliği (`SVG viewBox Matrix`):** Harita yakınlaştırıldığında çözünürlük kaybını önlemek için doğrudan SVG'nin öz yerel niteliği olan dinamik `viewBox` mercek matrisi kullanılmıştır. Sonsuz yakınlaştırmada bile pürüzsüz vektör keskinliği sunur.

---

## 🌌 Öne Çıkan Astronomik Yetenekler

* **4 Çeyrekli Kesintisiz Evre Shader'ı:** Ay ve gezegenlerin Dünyadan bakıldığında sergilediği faz geçişleri, yön şaşırmayan ve dolunay sınırlarında atlama yapmayan saf küresel ortografik izdüşüm maskesi ile milimetrik modellenmiştir.
* **Canlı Foton Kronometresi:** Seçilen gezegenin Dünya'ya olan anlık astronomik mesafesi (AU) ışık hızına ($c$) oranlanarak Güneş'ten çıkan bir ışık taneciğinin o gezegene ulaşma süresini canlı gösterir.
* **Gözlem Radarı (`Sky Map`):** Seçilen koordinatın boylam ve yerel aktif saat verilerini saniyede bir işleyerek, o an ufuk çizgisinin üzerinde kalan gezegenleri deterministik dijital bir radar üzerinde simüle eder.
* **Teleskop Shimmer Efekti:** Detay vizöründe SVG `<feTurbulence>` ve `<feDisplacementMap>` filtreleri yardımıyla Dünya atmosferindeki termal hava hareketlerinin arkasından bakılıyormuş gibi bir teleskop merceği dalgalanması yaratılır.

---

## 🔒 Küçük Bir Not / Emeğe Saygı :)

Bu simülasyon tamamen bir hobi, kişisel öğrenme ve eğlence projesi olarak büyük bir özenle geliştirilmiştir. Kod tabanını inceleyebilir, mantığından esinlenebilir ve kendi uzay projeleriniz için feyzalabilirsiniz. 

Ancak emeğe saygı adına, projenin tamamını veya matematik motorunu doğrudan kopyalayıp, arayüzü hiç değiştirmeden *"kendi ürünüymüş gibi"* başka mecralarda yayınlamamanızı rica ederim. Geliştirici dostu kalalım! 🚀

*Gözlemevi Project — 2026. Tüm Hakları Saklıdır.*