# Ui.Vision [RPA](https://ui.vision/rpa)

- Yapay Zeka Destekli Robotik Süreç Otomasyonu (RPA), Selenium IDE içe/dışa aktarma özelliğini içerir.

Sorularınız mı var? Önerileriniz mi var? - [Ui.Vision RPA kullanıcı forumunda](https://forum.ui.vision) bizimle buluşun.

Her kullanıcı, forumda sorulan sorulardan ve verilen yanıtlardan faydalanır; bu nedenle, sorunuz halka açık bir forum için uygunsa, sorunuzu önce [RPA forumunda](https://forum.ui.vision) paylaşmanızı rica ederiz. Forum, aktif kullanıcılar, teknik destek ekibi ve geliştiriciler tarafından izlenmektedir, bu nedenle tartışmaları tek bir yerde toplamayı tercih ediyoruz.


# Ui.Vision Nasıl Kurulur:

Chrome, Edge ve Firefox için Ui.Vision RPA; macOS, Linux ve Windows için modern, platformlar arası bir RPA yazılımıdır. Bir Selenium IDE ve Web Makro Kaydedici içerir. En güncel sürümü her zaman Chrome ve Firefox mağazalarında bulabilirsiniz. Hem kişisel hem de ticari amaçlar için *tamamen ücretsiz* kullanabilirsiniz:

- [Google Chrome Web Mağazası'nda UI.Vision](https://chrome.google.com/webstore/detail/uivision-rpa/gcbalfbdmfieckjlnblleoemohcganoc)

- [Firefox Web Mağazası'nda UI.Vision](https://addons.mozilla.org/en-US/firefox/addon/rpa/)

- [Microsoft Edge Web Mağazası'nda UI.Vision](https://microsoftedge.microsoft.com/addons/detail/uivision-rpa/goapmjinbaeomoemgdcnnhoedopjnddd)


- [Ui.Vision Ana Sayfası](https://ui.vision/rpa)

- Desteklenen [Selenium IDE komutlarının listesi](https://ui.vision/rpa/docs/selenium-ide/)


# Chrome, Edge ve Firefox Uzantısını Derleme

Uzantıyı sadece kullanmak istiyorsanız, derlemenize gerek *yoktur*.

Ui.Vision'ı doğrudan [Chrome, Edge veya Firefox mağazalarından yükleyebilirsiniz](https://ui.vision/rpa). Bu, Ui.Vision RPA yazılımını kullanmanın en kolay ve önerilen yoludur. Eski sürümlere [RPA yazılım arşivinden](https://ui.vision/rpa/archive) ulaşabilirsiniz.

Aşağıdaki bilgiler sadece geliştiriciler içindir ve onlara yöneliktir:

Proje Node V20.11.1 ve NPM V10.2.4 sürümlerini kullanmaktadır.

Herhangi bir sorunuz olursa lütfen TEAM AT UI.VISION adresi üzerinden bizimle iletişime geçin - Teşekkürler!

# Uzantı paketini derlemek için

```bash
npm i -f

npm run build   	
npm run build-ff 	
```

Derleme dosyaları `dist` ve `dist_ff` klasörlerinde yer alır.

# Geliştirme yapmak için
```bash
npm i -f

npm run ext
```

Geliştirme sırasındaki derleme dosyaları da `dist` ve `dist_ff` klasörlerinde yer alır.

İşlem tamamlandığında, kullanıma hazır uzantı kodu /dist dizininde (Chrome) veya /dist_ff dizininde (Firefox) görünür.
