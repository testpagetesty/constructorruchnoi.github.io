import React, { useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Switch, 
  FormControlLabel,
  Collapse,
  Card,
  CardContent,
  TextField
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 8,
}));

// Встроенные переводы
const allTranslations = {
  "version": "1.0",
  "languages": 31,
  "welcomeMessage": {
    "ru": "Добро пожаловать! 👋 Мы рады видеть вас в нашем чате. Как мы можем помочь вам сегодня?",
    "en": "Welcome! 👋 We're glad to see you in our chat. How can we help you today?",
    "es": "¡Bienvenido! 👋 Nos alegra verte en nuestro chat. ¿Cómo podemos ayudarte hoy?",
    "tr": "Hoş geldiniz! 👋 Sizi sohbetimizde görmekten memnunuz. Bugün size nasıl yardımcı olabiliriz?",
    "de": "Willkommen! 👋 Wir freuen uns, Sie in unserem Chat zu sehen. Wie können wir Ihnen heute helfen?",
    "it": "Benvenuto! 👋 Siamo felici di vedervi nella nostra chat. Come possiamo aiutarvi oggi?",
    "pt": "Bem-vindos! 👋 Estamos felizes por vos ver no nosso chat. Como vos podemos ajudar hoje?",
    "nl": "Welkom! 👋 We zijn blij jullie in onze chat te zien. Hoe kunnen we jullie vandaag helpen?",
    "ja": "いらっしゃいませ！👋 チャットにお越しいただき、ありがとうございます。本日はどのようなご用件でしょうか？",
    "ko": "환영합니다! 👋 저희 채팅에 오신 것을 환영합니다. 오늘 어떻게 도와드릴까요?",
    "he": "ברוכים הבאים! 👋 אנחנו שמחים לראות אתכם בצ'אט שלנו. איך אנחנו יכולים לעזור לכם היום?",
    "hi": "स्वागत है! 👋 हम आपको अपनी चैट में देखकर खुश हैं। आज हम आपकी कैसे मदद कर सकते हैं?",
    "uk": "Ласкаво просимо! 👋 Ми раді бачити вас у нашому чаті. Як ми можемо допомогти вам сьогодні?",
    "zh": "欢迎！👋 很高兴在我们的聊天中看到您。今天我们如何为您提供帮助？",
    "ar": "مرحباً بكم! 👋 نحن سعداء لرؤيتكم في دردشتنا. كيف يمكننا مساعدتكم اليوم؟",
    "fr": "Bienvenue ! 👋 Nous sommes ravis de vous voir dans notre chat. Comment pouvons-nous vous aider aujourd'hui ?",
    "pl": "Witamy! 👋 Cieszymy się, że jesteście w naszym czacie. Jak możemy Państwu dzisiaj pomóc?",
    "cs": "Vítejte! 👋 Jsme rádi, že vás vidíme v našem chatu. Jak vám dnes můžeme pomoci?",
    "da": "Velkommen! 👋 Vi er glade for at se jer i vores chat. Hvordan kan vi hjælpe jer i dag?",
    "fi": "Tervetuloa! 👋 Olemme iloisia nähdä teidät chatissamme. Kuinka voimme auttaa teitä tänään?",
    "el": "Καλώς ήρθατε! 👋 Χαιρόμαστε που σας βλέπουμε στο chat μας. Πώς μπορούμε να σας βοηθήσουμε σήμερα;",
    "hu": "Üdvözöljük! 👋 Örülünk, hogy látjuk önöket a chatünkben. Hogyan segíthetünk ma?",
    "no": "Velkommen! 👋 Vi er glade for å se dere i vår chat. Hvordan kan vi hjelpe dere i dag?",
    "ro": "Bun venit! 👋 Ne bucurăm să vă vedem în chat-ul nostru. Cum vă putem ajuta astăzi?",
    "sv": "Välkommen! 👋 Vi är glada att se er i vår chat. Hur kan vi hjälpa er idag?",
    "th": "ยินดีต้อนรับ! 👋 เรายินดีที่ได้เห็นคุณในแชทของเรา วันนี้เราจะช่วยคุณอย่างไร?",
    "vi": "Chào mừng! 👋 Chúng tôi rất vui khi thấy bạn trong cuộc trò chuyện của chúng tôi. Hôm nay chúng tôi có thể giúp bạn như thế nào?",
    "bg": "Добре дошли! 👋 Радваме се да ви видим в нашия чат. Как можем да ви помогнем днес?",
    "sr": "Добродошли! 👋 Драго нам је што вас видимо у нашем чету. Како можемо да вам помогнемо данас?",
    "sk": "Vitajte! 👋 Tešíme sa, že vás vidíme v našom chate. Ako vám dnes môžeme pomôcť?",
    "sl": "Dobrodošli! 👋 Veseli smo, da vas vidimo v našem klepetu. Kako vam lahko pomagamo danes?"
  },
  "presetResponses": {
    "ru": [
      "Рады, что вы к нам обратились! 😊 Наши специалисты уже работают над вашим вопросом.",
      "Спасибо за ваше сообщение! Мы ценим ваше доверие и обязательно поможем вам.",
      "Отлично! Ваш запрос принят. Наша команда специалистов спешит с ответом! ⚡",
      "Благодарим за обращение! Мы уже подключили к решению вашего вопроса наших экспертов.",
      "Замечательно! Ваше сообщение получено. Специалисты уже анализируют ситуацию. 🔍",
      "Прекрасно! Мы получили ваш запрос и уже начали работу над ним!"
    ],
    "en": [
      "Glad you contacted us! 😊 Our specialists are already working on your question.",
      "Thank you for your message! We value your trust and will definitely help you.",
      "Excellent! Your request has been accepted. Our team of specialists is rushing to respond! ⚡",
      "Thank you for contacting us! We have already connected our experts to solve your question.",
      "Wonderful! Your message has been received. Specialists are already analyzing the situation. 🔍",
      "Perfect! We have received your request and have already started working on it!"
    ],
    "es": [
      "¡Nos alegra que nos contacten! 😊 Nuestros especialistas ya están trabajando en su consulta.",
      "¡Gracias por su mensaje! Valoramos su confianza y definitivamente les ayudaremos.",
      "¡Excelente! Su solicitud ha sido aceptada. ¡Nuestro equipo de especialistas se apresura a responder! ⚡",
      "¡Gracias por contactarnos! Ya hemos conectado a nuestros expertos para resolver su pregunta.",
      "¡Maravilloso! Su mensaje ha sido recibido. Los especialistas ya están analizando la situación. 🔍",
      "¡Perfecto! Hemos recibido su solicitud y ya hemos comenzado a trabajar en ella!"
    ],
    "tr": [
      "Bizimle iletişime geçtiğiniz için memnunuz! 😊 Uzmanlarımız sorunuz üzerinde çalışmaya başladı.",
      "Mesajınız için teşekkür ederiz! Güveninizi değerli buluyoruz ve size kesinlikle yardımcı olacağız.",
      "Mükemmel! Talebiniz kabul edildi. Uzman ekibimiz yanıtlamak için acele ediyor! ⚡",
      "Bizimle iletişime geçtiğiniz için teşekkürler! Sorunuzu çözmek için uzmanlarımızı görevlendirdik.",
      "Harika! Mesajınız alındı. Uzmanlar durumu analiz etmeye başladı. 🔍",
      "Mükemmel! Talebinizi aldık ve üzerinde çalışmaya başladık!"
    ],
    "de": [
      "Freut uns, dass Sie uns kontaktiert haben! 😊 Unsere Spezialisten arbeiten bereits an Ihrer Anfrage.",
      "Vielen Dank für Ihre Nachricht! Wir schätzen Ihr Vertrauen und werden Ihnen definitiv helfen.",
      "Ausgezeichnet! Ihre Anfrage wurde angenommen. Unser Spezialistenteam beeilt sich zu antworten! ⚡",
      "Danke, dass Sie uns kontaktiert haben! Wir haben bereits unsere Experten beauftragt, Ihre Frage zu lösen.",
      "Wunderbar! Ihre Nachricht wurde erhalten. Die Spezialisten analysieren bereits die Situation. 🔍",
      "Perfekt! Wir haben Ihre Anfrage erhalten und bereits mit der Bearbeitung begonnen!"
    ],
    "it": [
      "Siamo felici che ci abbiate contattato! 😊 I nostri specialisti stanno già lavorando sulla vostra domanda.",
      "Grazie per il vostro messaggio! Apprezziamo la vostra fiducia e vi aiuteremo sicuramente.",
      "Eccellente! La vostra richiesta è stata accettata. Il nostro team di specialisti si affretta a rispondere! ⚡",
      "Grazie per averci contattato! Abbiamo già coinvolto i nostri esperti per risolvere la vostra domanda.",
      "Meraviglioso! Il vostro messaggio è stato ricevuto. Gli specialisti stanno già analizzando la situazione. 🔍",
      "Perfetto! Abbiamo ricevuto la vostra richiesta e abbiamo già iniziato a lavorarci!"
    ],
    "pt": [
      "Ficamos felizes por nos contactarem! 😊 Os nossos especialistas já estão a trabalhar na vossa pergunta.",
      "Obrigado pela vossa mensagem! Valorizamos a vossa confiança e definitivamente vos ajudaremos.",
      "Excelente! O vosso pedido foi aceite. A nossa equipa de especialistas apressa-se a responder! ⚡",
      "Obrigado por nos contactarem! Já envolvemos os nossos peritos para resolver a vossa pergunta.",
      "Maravilhoso! A vossa mensagem foi recebida. Os especialistas já estão a analisar a situação. 🔍",
      "Perfeito! Recebemos o vosso pedido e já começámos a trabalhar nele!"
    ],
    "nl": [
      "Blij dat jullie ons hebben gecontacteerd! 😊 Onze specialisten werken al aan jullie vraag.",
      "Dank je voor je bericht! We waarderen jullie vertrouwen en zullen jullie zeker helpen.",
      "Uitstekend! Jullie verzoek is geaccepteerd. Ons team van specialisten haast zich om te antwoorden! ⚡",
      "Bedankt voor het contact! We hebben al onze experts betrokken om jullie vraag op te lossen.",
      "Geweldig! Jullie bericht is ontvangen. De specialisten analyseren de situatie al. 🔍",
      "Perfect! We hebben jullie verzoek ontvangen en zijn er al mee begonnen!"
    ],
    "ja": [
      "お問い合わせいただき、ありがとうございます！😊 専門スタッフがすでにご質問に取り組んでおります。",
      "メッセージをありがとうございます！お客様の信頼を大切にし、必ずお手伝いいたします。",
      "素晴らしい！ご依頼を承りました。専門チームが急いで対応いたします！⚡",
      "お問い合わせありがとうございます！ご質問解決のため、専門家を配置いたしました。",
      "素晴らしい！メッセージを受信いたしました。専門スタッフが状況を分析中です。🔍",
      "完璧です！ご依頼を受け、すでに作業を開始しております！"
    ],
    "ko": [
      "문의해 주셔서 기쁩니다! 😊 저희 전문가들이 이미 귀하의 질문에 대해 작업하고 있습니다.",
      "메시지 감사합니다! 귀하의 신뢰를 소중히 여기며 반드시 도움을 드리겠습니다.",
      "훌륭합니다! 귀하의 요청이 접수되었습니다. 저희 전문가 팀이 빠르게 응답하고 있습니다! ⚡",
      "문의해 주셔서 감사합니다! 귀하의 질문 해결을 위해 이미 전문가를 배정했습니다.",
      "멋집니다! 귀하의 메시지를 받았습니다. 전문가들이 이미 상황을 분석하고 있습니다. 🔍",
      "완벽합니다! 귀하의 요청을 받았으며 이미 작업을 시작했습니다!"
    ],
    "he": [
      "שמחים שפניתם אלינו! 😊 המומחים שלנו כבר עובדים על השאלה שלכם.",
      "תודה על ההודעה שלכם! אנחנו מעריכים את האמון שלכם ובהחלט נעזור לכם.",
      "מעולה! הבקשה שלכם התקבלה. צוות המומחים שלנו ממהר להגיב! ⚡",
      "תודה שפניתם אלינו! כבר שילבנו את המומחים שלנו לפתרון השאלה שלכם.",
      "נפלא! ההודעה שלכם התקבלה. המומחים כבר מנתחים את המצב. 🔍",
      "מושלם! קיבלנו את הבקשה שלכם וכבר התחלנו לעבוד עליה!"
    ],
    "hi": [
      "हमसे संपर्क करने के लिए खुशी है! 😊 हमारे विशेषज्ञ पहले से ही आपके प्रश्न पर काम कर रहे हैं।",
      "आपके संदेश के लिए धन्यवाद! हम आपके भरोसे की कदर करते हैं और निश्चित रूप से आपकी मदद करेंगे।",
      "उत्कृष्ट! आपका अनुरोध स्वीकार कर लिया गया है। हमारी विशेषज्ञ टीम जवाब देने के लिए जल्दी कर रही है! ⚡",
      "हमसे संपर्क करने के लिए धन्यवाद! हमने आपके प्रश्न को हल करने के लिए पहले से ही अपने विशेषज्ञों को शामिल किया है।",
      "अद्भुत! आपका संदेश प्राप्त हो गया है। विशेषज्ञ पहले से ही स्थिति का विश्लेषण कर रहे हैं। 🔍",
      "बिल्कुल सही! हमें आपका अनुरोध मिल गया है और हमने पहले से ही इस पर काम करना शुरू कर दिया है!"
    ],
    "uk": [
      "Раді, що ви звернулися до нас! 😊 Наші спеціалісти вже працюють над вашим питанням.",
      "Дякуємо за ваше повідомлення! Ми цінуємо вашу довіру і обов'язково допоможемо вам.",
      "Відмінно! Ваш запит прийнято. Наша команда спеціалістів поспішає з відповіддю! ⚡",
      "Дякуємо за звернення! Ми вже залучили наших експертів для вирішення вашого питання.",
      "Чудово! Ваше повідомлення отримано. Спеціалісти вже аналізують ситуацію. 🔍",
      "Прекрасно! Ми отримали ваш запит і вже почали над ним працювати!"
    ],
    "zh": [
      "很高兴您联系我们！😊 我们的专家已经在处理您的问题了。",
      "感谢您的留言！我们珍视您的信任，一定会帮助您。",
      "太好了！您的请求已被接受。我们的专家团队正在加紧回复！⚡",
      "感谢您的联系！我们已经安排专家来解决您的问题。",
      "太棒了！我们已收到您的消息。专家们正在分析情况。🔍",
      "完美！我们已收到您的请求，并已开始处理！"
    ],
    "ar": [
      "يسعدنا تواصلكم معنا! 😊 خبراؤنا يعملون بالفعل على استفساركم.",
      "شكراً لرسالتكم! نحن نقدر ثقتكم وسنساعدكم بالتأكيد.",
      "ممتاز! تم قبول طلبكم. فريق الخبراء لدينا يسارع للرد! ⚡",
      "شكراً لتواصلكم معنا! لقد أشركنا خبراءنا لحل استفساركم.",
      "رائع! تم استلام رسالتكم. الخبراء يحللون الوضع الآن. 🔍",
      "مثالي! تلقينا طلبكم وبدأنا العمل عليه بالفعل!"
    ],
    "fr": [
      "Ravi que vous nous contactiez ! 😊 Nos spécialistes travaillent déjà sur votre question.",
      "Merci pour votre message ! Nous apprécions votre confiance et vous aiderons certainement.",
      "Excellent ! Votre demande a été acceptée. Notre équipe de spécialistes se dépêche de répondre ! ⚡",
      "Merci de nous avoir contactés ! Nous avons déjà mobilisé nos experts pour résoudre votre question.",
      "Formidable ! Votre message a été reçu. Les spécialistes analysent déjà la situation. 🔍",
      "Parfait ! Nous avons reçu votre demande et avons déjà commencé à travailler dessus !"
    ],
    "pl": [
      "Cieszymy się, że się z nami skontaktowali! 😊 Nasi specjaliści już pracują nad Państwa pytaniem.",
      "Dziękujemy za wiadomość! Cenimy Państwa zaufanie i na pewno pomożemy.",
      "Doskonale! Państwa prośba została przyjęta. Nasz zespół specjalistów śpieszy z odpowiedzią! ⚡",
      "Dziękujemy za kontakt! Już włączyliśmy naszych ekspertów do rozwiązania Państwa pytania.",
      "Wspaniale! Państwa wiadomość została odebrana. Specjaliści już analizują sytuację. 🔍",
      "Idealnie! Otrzymaliśmy Państwa prośbę i już zaczęliśmy nad nią pracować!"
    ],
    "cs": [
      "Jsme rádi, že jste nás kontaktovali! 😊 Naši specialisté již pracují na vaší otázce.",
      "Děkujeme za vaši zprávu! Vážíme si vaší důvěry a určitě vám pomůžeme.",
      "Výborně! Vaše žádost byla přijata. Náš tým specialistů se spěchá odpovědět! ⚡",
      "Děkujeme, že jste nás kontaktovali! Již jsme zapojili naše experty k vyřešení vaší otázky.",
      "Skvělé! Vaše zpráva byla přijata. Specialisté již analyzují situaci. 🔍",
      "Perfektní! Obdrželi jsme vaši žádost a již jsme na ní začali pracovat!"
    ],
    "da": [
      "Glæder os over, at I har kontaktet os! 😊 Vores specialister arbejder allerede på jeres spørgsmål.",
      "Tak for jeres besked! Vi værdsætter jeres tillid og vil bestemt hjælpe jer.",
      "Fremragende! Jeres anmodning er blevet accepteret. Vores team af specialister skynder sig at svare! ⚡",
      "Tak for at kontakte os! Vi har allerede involveret vores eksperter til at løse jeres spørgsmål.",
      "Vidunderligt! Jeres besked er modtaget. Specialisterne analyserer allerede situationen. 🔍",
      "Perfekt! Vi har modtaget jeres anmodning og er allerede begyndt at arbejde på den!"
    ],
    "fi": [
      "Iloisia, että otitte yhteyttä! 😊 Asiantuntijamme työskentelevät jo kysymyksenne parissa.",
      "Kiitos viestistänne! Arvostamme luottamustanne ja autamme teitä varmasti.",
      "Erinomaista! Pyyntönne on hyväksytty. Asiantuntijatiimimme kiirehtii vastaamaan! ⚡",
      "Kiitos yhteydenotosta! Olemme jo ottaneet asiantuntijamme mukaan kysymyksenne ratkaisemiseen.",
      "Mahtavaa! Viestinne on vastaanotettu. Asiantuntijat analysoivat jo tilannetta. 🔍",
      "Täydellistä! Saimme pyyntönne ja olemme jo alkaneet työskennellä sen parissa!"
    ],
    "el": [
      "Χαιρόμαστε που επικοινωνήσατε μαζί μας! 😊 Οι ειδικοί μας εργάζονται ήδη στην ερώτησή σας.",
      "Ευχαριστούμε για το μήνυμά σας! Εκτιμούμε την εμπιστοσύνη σας και σίγουρα θα σας βοηθήσουμε.",
      "Εξαιρετικό! Το αίτημά σας έγινε δεκτό. Η ομάδα ειδικών μας βιάζεται να απαντήσει! ⚡",
      "Ευχαριστούμε που επικοινωνήσατε! Έχουμε ήδη εμπλέξει τους ειδικούς μας για να λύσουμε την ερώτησή σας.",
      "Υπέροχα! Το μήνυμά σας παραλήφθηκε. Οι ειδικοί αναλύουν ήδη την κατάσταση. 🔍",
      "Τέλεια! Λάβαμε το αίτημά σας και έχουμε ήδη αρχίσει να εργαζόμαστε πάνω του!"
    ],
    "hu": [
      "Örülünk, hogy kapcsolatba léptek velünk! 😊 Szakértőink már dolgoznak a kérdéseteken.",
      "Köszönjük az üzeneteteket! Értékeljük a bizalmatokat és biztosan segítünk nektek.",
      "Kiváló! A kérésetek elfogadásra került. Szakértői csapatunk siet válaszolni! ⚡",
      "Köszönjük, hogy kapcsolatba léptetek! Már bevontuk szakértőinket a kérdésetek megoldásába.",
      "Csodálatos! Az üzeneteteket megkaptuk. A szakértők már elemzik a helyzetet. 🔍",
      "Tökéletes! Megkaptuk a kéréseteteket és már elkezdtünk dolgozni rajta!"
    ],
    "no": [
      "Glade for at dere kontaktet oss! 😊 Våre spesialister jobber allerede med spørsmålet deres.",
      "Takk for meldingen deres! Vi setter pris på tilliten deres og vil definitivt hjelpe dere.",
      "Utmerket! Forespørselen deres har blitt akseptert. Vårt team av spesialister haster med å svare! ⚡",
      "Takk for at dere kontaktet oss! Vi har allerede involvert våre eksperter for å løse spørsmålet deres.",
      "Fantastisk! Meldingen deres er mottatt. Spesialistene analyserer allerede situasjonen. 🔍",
      "Perfekt! Vi har mottatt forespørselen deres og har allerede begynt å jobbe med den!"
    ],
    "ro": [
      "Ne bucurăm că ne-ați contactat! 😊 Specialiștii noștri lucrează deja la întrebarea dumneavoastră.",
      "Mulțumim pentru mesajul dumneavoastră! Apreciem încrederea dumneavoastră și cu siguranță vă vom ajuta.",
      "Excelent! Cererea dumneavoastră a fost acceptată. Echipa noastră de specialiști se grăbește să răspundă! ⚡",
      "Mulțumim că ne-ați contactat! Am implicat deja experții noștri pentru a rezolva întrebarea dumneavoastră.",
      "Minunat! Mesajul dumneavoastră a fost primit. Specialiștii analizează deja situația. 🔍",
      "Perfect! Am primit cererea dumneavoastră și am început deja să lucrăm la ea!"
    ],
    "sv": [
      "Glada att ni kontaktade oss! 😊 Våra specialister arbetar redan med er fråga.",
      "Tack för ert meddelande! Vi uppskattar ert förtroende och kommer definitivt att hjälpa er.",
      "Utmärkt! Er förfrågan har accepterats. Vårt team av specialister skyndar sig att svara! ⚡",
      "Tack för att ni kontaktade oss! Vi har redan involverat våra experter för att lösa er fråga.",
      "Underbart! Ert meddelande har mottagits. Specialisterna analyserar redan situationen. 🔍",
      "Perfekt! Vi har mottagit er förfrågan och har redan börjat arbeta med den!"
    ],
    "th": [
      "ดีใจที่คุณติดต่อเรา! 😊 ผู้เชี่ยวชาญของเรากำลังทำงานกับคำถามของคุณแล้ว",
      "ขอบคุณสำหรับข้อความของคุณ! เราให้ความสำคัญกับความไว้วางใจของคุณและจะช่วยเหลือคุณอย่างแน่นอน",
      "ยอดเยี่ยม! คำขอของคุณได้รับการยอมรับแล้ว ทีมผู้เชี่ยวชาญของเรากำลังรีบตอบกลับ! ⚡",
      "ขอบคุณที่ติดต่อเรา! เราได้เชิญผู้เชี่ยวชาญของเรามาช่วยแก้ไขคำถามของคุณแล้ว",
      "ยอดเยี่ยม! ข้อความของคุณได้รับแล้ว ผู้เชี่ยวชาญกำลังวิเคราะห์สถานการณ์อยู่ 🔍",
      "สมบูรณ์แบบ! เราได้รับคำขอของคุณและเริ่มทำงานแล้ว!"
    ],
    "vi": [
      "Rất vui khi bạn liên hệ với chúng tôi! 😊 Các chuyên gia của chúng tôi đã đang làm việc với câu hỏi của bạn.",
      "Cảm ơn tin nhắn của bạn! Chúng tôi đánh giá cao sự tin tưởng của bạn và chắc chắn sẽ giúp đỡ bạn.",
      "Tuyệt vời! Yêu cầu của bạn đã được chấp nhận. Đội ngũ chuyên gia của chúng tôi đang vội vã trả lời! ⚡",
      "Cảm ơn bạn đã liên hệ! Chúng tôi đã huy động các chuyên gia để giải quyết câu hỏi của bạn.",
      "Tuyệt vời! Tin nhắn của bạn đã được nhận. Các chuyên gia đang phân tích tình hình. 🔍",
      "Hoàn hảo! Chúng tôi đã nhận được yêu cầu của bạn và đã bắt đầu làm việc!"
    ],
    "bg": [
      "Радваме се, че се свързахте с нас! 😊 Нашите специалисти вече работят по вашия въпрос.",
      "Благодарим за съобщението ви! Ценим доверието ви и определено ще ви помогнем.",
      "Отлично! Заявката ви беше приета. Нашият екип от специалисти бърза да отговори! ⚡",
      "Благодарим, че се свързахте с нас! Вече включихме нашите експерти за решаване на въпроса ви.",
      "Прекрасно! Съобщението ви беше получено. Специалистите вече анализират ситуацията. 🔍",
      "Перфектно! Получихме заявката ви и вече започнахме да работим по нея!"
    ],
    "sr": [
      "Драго нам је што сте нас контактирали! 😊 Наши стручњаци већ раде на вашем питању.",
      "Хвала на вашој поруци! Ценимо ваше поверење и дефинитивно ћемо вам помоћи.",
      "Одлично! Ваш захтев је прихваћен. Наш тим стручњака жури да одговори! ⚡",
      "Хвала што сте нас контактирали! Већ смо укључили наше експерте да реше ваше питање.",
      "Дивно! Ваша порука је примљена. Стручњаци већ анализирају ситуацију. 🔍",
      "Савршено! Примили смо ваш захтев и већ смо почели да радимо на њему!"
    ],
    "sk": [
      "Tešíme sa, že ste nás kontaktovali! 😊 Naši špecialisti už pracujú na vašej otázke.",
      "Ďakujeme za vašu správu! Vážime si vašu dôveru a určite vám pomôžeme.",
      "Výborne! Vaša žiadosť bola prijatá. Náš tím špecializovaných odborníkov sa ponáhľa odpovedať! ⚡",
      "Ďakujeme, že ste nás kontaktovali! Už sme zapojili našich expertov na vyriešenie vašej otázky.",
      "Skvelé! Vaša správa bola prijatá. Špecialisti už analyzujú situáciu. 🔍",
      "Perfektné! Dostali sme vašu žiadosť a už sme na nej začali pracovať!"
    ],
    "sl": [
      "Veseli smo, da ste nas kontaktirali! 😊 Naši strokovnjaki že delajo na vašem vprašanju.",
      "Hvala za vaše sporočilo! Cenimo vaše zaupanje in vam bomo zagotovo pomagali.",
      "Odlično! Vaša zahteva je bila sprejeta. Naša ekipa strokovnjakov se mudi z odgovorom! ⚡",
      "Hvala, da ste nas kontaktirali! Že smo vključili naše strokovnjake za rešitev vašega vprašanja.",
      "Čudovito! Vaše sporočilo je bilo prejeto. Strokovnjaki že analizirajo situacijo. 🔍",
      "Popolno! Prejeli smo vašo zahtevo in že smo začeli delati na njej!"
    ]
  },
  "busySpecialistsMessage": {
    "ru": "К сожалению, наши специалисты заняты из-за большой нагрузки. Пожалуйста, заполните форму обращения в конце сайта для получения персональной консультации. 📋",
    "en": "Unfortunately, our specialists are busy due to high workload. Please fill out the contact form at the end of the site for personalized consultation. 📋",
    "es": "Lamentablemente, nuestros especialistas están ocupados debido a la alta carga de trabajo. Por favor, completen el formulario de contacto al final del sitio para una consulta personalizada. 📋",
    "tr": "Maalesef, uzmanlarımız yoğun iş yükü nedeniyle meşguller. Kişiselleştirilmiş danışmanlık için lütfen sitenin sonundaki iletişim formunu doldurun. 📋",
    "de": "Leider sind unsere Spezialisten aufgrund hoher Arbeitsbelastung beschäftigt. Bitte füllen Sie das Kontaktformular am Ende der Website für eine persönliche Beratung aus. 📋",
    "it": "Purtroppo, i nostri specialisti sono occupati a causa dell'alto carico di lavoro. Per favore, compilate il modulo di contatto alla fine del sito per una consulenza personalizzata. 📋",
    "pt": "Infelizmente, nossos especialistas estão ocupados devido à alta carga de trabalho. Por favor, preencham o formulário de contato no final do site para consulta personalizada. 📋",
    "nl": "Helaas zijn onze specialisten bezig vanwege de hoge werkdruk. Vul het contactformulier aan het einde van de site in voor persoonlijk advies. 📋",
    "ja": "申し訳ございませんが、専門スタッフは業務量が多いため対応中です。個別相談については、サイト末尾のお問い合わせフォームにご記入ください。📋",
    "ko": "죄송하지만 업무량이 많아 전문가들이 바쁩니다. 개인 상담을 위해 사이트 끝에 있는 문의 양식을 작성해 주세요. 📋",
    "he": "למרבה הצער, המומחים שלנו עסוקים בגלל עומס עבודה גבוה. אנא מלאו את טופס הפנייה בסוף האתר לקבלת ייעוץ אישי. 📋",
    "hi": "खुशी की बात है कि हमारे विशेषज्ञ अधिक कार्यभार के कारण व्यस्त हैं। व्यक्तिगत परामर्श के लिए कृपया साइट के अंत में संपर्क फॉर्म भरें। 📋",
    "uk": "На жаль, наші спеціалісти зайняті через велике навантаження. Будь ласка, заповніть форму звернення в кінці сайту для отримання персональної консультації. 📋",
    "zh": "很抱歉，我们的专家由于工作量大而忙碌。请填写网站末尾的联系表格以获得个性化咨询。📋",
    "ar": "للأسف، خبراؤنا مشغولون بسبب ضغط العمل الكبير. يرجى ملء نموذج الاتصال في نهاية الموقع للحصول على استشارة شخصية. 📋",
    "fr": "Malheureusement, nos spécialistes sont occupés en raison d'une forte charge de travail. Veuillez remplir le formulaire de contact à la fin du site pour une consultation personnalisée. 📋",
    "pl": "Niestety, nasi specjaliści są zajęci z powodu dużego obciążenia pracą. Proszę wypełnić formularz kontaktowy na końcu strony, aby uzyskać spersonalizowaną konsultację. 📋",
    "cs": "Bohužel jsou naši specialisté zaneprázdněni kvůli vysoké pracovní zátěži. Prosím vyplňte kontaktní formulář na konci stránky pro personalizovanou konzultaci. 📋",
    "da": "Desværre er vores specialister optaget på grund af høj arbejdsbyrde. Udfyld venligst kontaktformularen i slutningen af siden for personlig rådgivning. 📋",
    "fi": "Valitettavasti asiantuntijamme ovat kiireisiä suuren työmäärän vuoksi. Täyttäkää yhteystietolomake sivun lopussa henkilökohtaista neuvontaa varten. 📋",
    "el": "Δυστυχώς, οι ειδικοί μας είναι απασχολημένοι λόγω μεγάλου φόρτου εργασίας. Παρακαλώ συμπληρώστε τη φόρμα επικοινωνίας στο τέλος του ιστότοπου για εξατομικευμένη συμβουλευτική. 📋",
    "hu": "Sajnos szakértőink elfoglaltak a nagy munkaterhelés miatt. Kérjük, töltse ki a kapcsolatfelvételi űrlapot az oldal végén személyre szabott tanácsadásért. 📋",
    "no": "Dessverre er våre spesialister opptatt på grunn av høy arbeidsmengde. Vennligst fyll ut kontaktskjemaet på slutten av siden for personlig rådgivning. 📋",
    "ro": "Din păcate, specialiștii noștri sunt ocupați din cauza volumului mare de muncă. Vă rugăm să completați formularul de contact de la sfârșitul site-ului pentru consultanță personalizată. 📋",
    "sv": "Tyvärr är våra specialister upptagna på grund av hög arbetsbelastning. Vänligen fyll i kontaktformuläret i slutet av sidan för personlig rådgivning. 📋",
    "th": "ขออภัย ผู้เชี่ยวชาญของเรายุ่งเนื่องจากภาระงานที่มาก กรุณากรอกแบบฟอร์มติดต่อที่ท้ายเว็บไซต์เพื่อรับคำปรึกษาเฉพาะบุคคล 📋",
    "vi": "Rất tiếc, các chuyên gia của chúng tôi đang bận rộn do khối lượng công việc lớn. Vui lòng điền vào biểu mẫu liên hệ ở cuối trang web để được tư vấn cá nhân. 📋",
    "bg": "За съжаление, нашите специалисти са заети поради голямото натоварване. Моля, попълнете формуляра за контакт в края на сайта за персонализирана консултация. 📋",
    "sr": "Нажалост, наши стручњаци су заузети због великог оптерећења. Молимо попуните контакт форму на крају сајта за персонализовано саветовање. 📋",
    "sk": "Bohužiaľ, naši špecialisti sú zaneprázdnení kvôli vysokému pracovnému zaťaženiu. Prosím vyplňte kontaktný formulár na konci stránky pre personalizované poradenstvo. 📋",
    "sl": "Žal so naši strokovnjaki zasedeni zaradi velike obremenitve z delom. Prosimo, izpolnite kontaktni obrazec na koncu strani za osebno svetovanje. 📋"
  },
  "welcomeMessage": {
    "ru": "Привет! Я виртуальный помощник {siteName}. Как могу помочь? 👋",
    "en": "Hello! I'm a virtual assistant from {siteName}. How can I help you? 👋",
    "es": "¡Hola! Soy un asistente virtual de {siteName}. ¿Cómo puedo ayudarles? 👋",
    "tr": "Merhaba! Ben {siteName} sanal asistanıyım. Size nasıl yardımcı olabilirim? 👋",
    "de": "Hallo! Ich bin ein virtueller Assistent von {siteName}. Wie kann ich Ihnen helfen? 👋",
    "it": "Ciao! Sono un assistente virtuale di {siteName}. Come posso aiutarvi? 👋",
    "pt": "Olá! Sou um assistente virtual da {siteName}. Como posso ajudar-vos? 👋",
    "nl": "Hallo! Ik ben een virtuele assistent van {siteName}. Hoe kan ik jullie helpen? 👋",
    "ja": "こんにちは！私は{siteName}のバーチャルアシスタントです。どのようにお手伝いできますか？👋",
    "ko": "안녕하세요! 저는 {siteName}의 가상 어시스턴트입니다. 어떻게 도와드릴까요? 👋",
    "he": "שלום! אני עוזר וירטואלי מ{siteName}. איך אני יכול לעזור לכם? 👋",
    "hi": "नमस्ते! मैं {siteName} का वर्चुअल असिस्टेंट हूं। मैं आपकी कैसे मदद कर सकता हूं? 👋",
    "uk": "Привіт! Я віртуальний помічник {siteName}. Як можу допомогти? 👋",
    "zh": "你好！我是{siteName}的虚拟助手。我如何为您提供帮助？👋",
    "ar": "مرحباً! أنا مساعد افتراضي من {siteName}. كيف يمكنني مساعدتكم؟ 👋",
    "fr": "Bonjour ! Je suis un assistant virtuel de {siteName}. Comment puis-je vous aider ? 👋",
    "pl": "Cześć! Jestem wirtualnym asystentem z {siteName}. Jak mogę Wam pomóc? 👋",
    "cs": "Ahoj! Jsem virtuální asistent z {siteName}. Jak vám mohu pomoci? 👋",
    "da": "Hej! Jeg er en virtuel assistent fra {siteName}. Hvordan kan jeg hjælpe jer? 👋",
    "fi": "Hei! Olen virtuaalinen avustaja {siteName}:sta. Miten voin auttaa teitä? 👋",
    "el": "Γεια σας! Είμαι ένας εικονικός βοηθός από {siteName}. Πώς μπορώ να σας βοηθήσω; 👋",
    "hu": "Sziasztok! Virtuális asszisztens vagyok a {siteName}-től. Hogyan segíthetek? 👋",
    "no": "Hei! Jeg er en virtuell assistent fra {siteName}. Hvordan kan jeg hjelpe dere? 👋",
    "ro": "Salut! Sunt un asistent virtual de la {siteName}. Cum vă pot ajuta? 👋",
    "sv": "Hej! Jag är en virtuell assistent från {siteName}. Hur kan jag hjälpa er? 👋",
    "th": "สวัสดี! ฉันเป็นผู้ช่วยเสมือนจาก {siteName} ฉันจะช่วยคุณได้อย่างไร? 👋",
    "vi": "Xin chào! Tôi là trợ lý ảo từ {siteName}. Tôi có thể giúp bạn như thế nào? 👋",
    "bg": "Здравейте! Аз съм виртуален асистент от {siteName}. Как мога да ви помогна? 👋",
    "sr": "Здраво! Ја сам виртуелни асистент из {siteName}. Како могу да вам помогнем? 👋",
    "sk": "Ahoj! Som virtuálny asistent z {siteName}. Ako vám môžem pomôcť? 👋",
    "sl": "Pozdravljeni! Jaz sem virtualni pomočnik iz {siteName}. Kako vam lahko pomagam? 👋"
  },
  "placeholder": {
    "ru": "Напишите ваше сообщение...",
    "en": "Type your message...",
    "es": "Escriban su mensaje...",
    "tr": "Mesajınızı yazın...",
    "de": "Schreiben Sie Ihre Nachricht...",
    "it": "Scrivete il vostro messaggio...",
    "pt": "Escrevam a vossa mensagem...",
    "nl": "Typ jullie bericht...",
    "ja": "メッセージを入力してください...",
    "ko": "메시지를 입력하세요...",
    "he": "הקלידו את ההודעה שלכם...",
    "hi": "अपना संदेश लिखें...",
    "uk": "Напишіть ваше повідомлення...",
    "zh": "输入您的消息...",
    "ar": "اكتبوا رسالتكم...",
    "fr": "Tapez votre message...",
    "pl": "Napisz swoją wiadomość...",
    "cs": "Napište svou zprávu...",
    "da": "Skriv jeres besked...",
    "fi": "Kirjoittakaa viestinne...",
    "el": "Γράψτε το μήνυμά σας...",
    "hu": "Írjátok meg az üzeneteteket...",
    "no": "Skriv meldingen deres...",
    "ro": "Scrieți mesajul dumneavoastră...",
    "sv": "Skriv ert meddelande...",
    "th": "พิมพ์ข้อความของคุณ...",
    "vi": "Nhập tin nhắn của bạn...",
    "bg": "Напишете съобщението си...",
    "sr": "Напишите вашу поруку...",
    "sk": "Napíšte svoju správu...",
    "sl": "Napišite svoje sporočilo..."
  },
  "statusMessage": {
    "ru": "💡 Для дальнейшей помощи заполните форму на сайте",
    "en": "💡 For further assistance, please fill out the form on the website",
    "es": "💡 Para más ayuda, por favor completen el formulario en el sitio web",
    "tr": "💡 Daha fazla yardım için lütfen web sitesindeki formu doldurun",
    "de": "💡 Für weitere Hilfe füllen Sie bitte das Formular auf der Website aus",
    "it": "💡 Per ulteriore assistenza, compilate il modulo sul sito web",
    "pt": "💡 Para mais assistência, preencham o formulário no site",
    "nl": "💡 Voor verdere hulp, vul het formulier op de website in",
    "ja": "💡 さらなるサポートについては、ウェブサイトのフォームにご記入ください",
    "ko": "💡 추가 지원을 위해 웹사이트의 양식을 작성해 주세요",
    "he": "💡 לעזרה נוספת, אנא מלאו את הטופס באתר",
    "hi": "💡 अधिक सहायता के लिए, कृपया वेबसाइट पर फॉर्म भरें",
    "uk": "💡 Для подальшої допомоги заповніть форму на сайті",
    "zh": "💡 如需进一步帮助，请填写网站上的表格",
    "ar": "💡 للحصول على مزيد من المساعدة، يرجى ملء النموذج على الموقع",
    "fr": "💡 Pour plus d'aide, veuillez remplir le formulaire sur le site web",
    "pl": "💡 Aby uzyskać dalszą pomoc, wypełnij formularz na stronie internetowej",
    "cs": "💡 Pro další pomoc vyplňte formulář na webové stránce",
    "da": "💡 For yderligere hjælp, udfyld formularen på hjemmesiden",
    "fi": "💡 Lisäapua varten täyttäkää lomake verkkosivustolla",
    "el": "💡 Για περαιτέρω βοήθεια, συμπληρώστε τη φόρμα στον ιστότοπο",
    "hu": "💡 További segítségért töltsétek ki az űrlapot a weboldalon",
    "no": "💡 For ytterligere hjelp, fyll ut skjemaet på nettstedet",
    "ro": "💡 Pentru asistență suplimentară, completați formularul de pe site",
    "sv": "💡 För ytterligare hjälp, fyll i formuläret på webbplatsen",
    "th": "💡 สำหรับความช่วยเหลือเพิ่มเติม โปรดกรอกแบบฟอร์มในเว็บไซต์",
    "vi": "💡 Để được hỗ trợ thêm, vui lòng điền vào biểu mẫu trên trang web",
    "bg": "💡 За допълнителна помощ, моля попълнете формуляра на уебсайта",
    "sr": "💡 За додатну помоћ, молимо попуните формулар на веб сајту",
    "sk": "💡 Pre ďalšiu pomoc vyplňte formulár na webovej stránke",
    "sl": "💡 Za nadaljnjo pomoč izpolnite obrazec na spletni strani"
  }
};

const LiveChatEditor = ({ 
  liveChatData = {}, 
  onLiveChatChange,
  expanded = false,
  onToggle,
  headerData = {}
}) => {
  const currentLanguage = String(headerData.language || 'en');
  
  const handleChange = (field, value) => {
    onLiveChatChange({
      ...liveChatData,
      [field]: value
    });
  };

  // Автоматическое обновление выбранных ответов при изменении языка
  useEffect(() => {
    if (currentLanguage && allTranslations.presetResponses) {
      const selectedResponses = allTranslations.presetResponses[currentLanguage] || allTranslations.presetResponses['en'];
      if (selectedResponses && Array.isArray(selectedResponses)) {
        const selectedText = selectedResponses.join('\n');
        handleChange('selectedResponses', selectedText);
      }
    }
  }, [currentLanguage]);

  return (
    <StyledCard>
      <CardContent>
        <Box 
          onClick={onToggle}
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            cursor: 'pointer',
            mb: 2
          }}
        >
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            💬 Лайв чат поддержки
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {expanded ? '▼' : '▶'}
          </Typography>
        </Box>

        <Collapse in={expanded}>
          <Box sx={{ mt: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={liveChatData.enabled || false}
                  onChange={(e) => handleChange('enabled', e.target.checked)}
                  color="primary"
                />
              }
              label="Включить лайв чат на сайте"
            />
            
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Выбранные варианты ответа (язык: {currentLanguage ? currentLanguage.toUpperCase() : 'EN'})
                  </Typography>
              <TextField
                fullWidth
                multiline
                rows={8}
                value={liveChatData.selectedResponses || ''}
                onChange={(e) => handleChange('selectedResponses', e.target.value)}
                placeholder="Здесь автоматически появятся ответы для выбранного языка..."
                variant="outlined"
                sx={{ mb: 2 }}
              />
                  </Box>
                  
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Все языки и варианты ответов
                  </Typography>
              <TextField
                fullWidth
                multiline
                rows={15}
                value={liveChatData.allTranslations || JSON.stringify(allTranslations, null, 2)}
                onChange={(e) => handleChange('allTranslations', e.target.value)}
                variant="outlined"
                sx={{ 
                  mb: 2,
                  '& .MuiInputBase-input': {
                    fontFamily: 'monospace',
                    fontSize: '12px'
                  }
                }}
              />
                </Box>
          </Box>
        </Collapse>
      </CardContent>
    </StyledCard>
  );
};

export default LiveChatEditor; 