import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Fab, 
  Paper, 
  TextField, 
  IconButton, 
  Typography, 
  Avatar,
  Divider,
  CircularProgress,
  Tooltip
} from '@mui/material';
import { 
  Chat as ChatIcon, 
  Close as CloseIcon, 
  Send as SendIcon,
  SmartToy as BotIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const ChatWidget = styled(Paper)(({ theme }) => ({
  position: 'fixed',
  bottom: 90,
  right: 20,
  width: 350,
  height: 500,
  display: 'flex',
  flexDirection: 'column',
  zIndex: 9999,
  borderRadius: 16,
  overflow: 'hidden',
  boxShadow: theme.shadows[8],
  border: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.down('sm')]: {
    width: 'calc(100vw - 20px)',
    right: 10,
    left: 10,
    bottom: 80,
    height: 450,
  }
}));

const ChatFab = styled(Fab)(({ theme }) => ({
  position: 'fixed',
  bottom: 20,
  right: 20,
  zIndex: 9998,
  backgroundColor: theme.palette.primary.main,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  }
}));

const ChatHeader = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
}));

const MessagesContainer = styled(Box)({
  flex: 1,
  overflowY: 'auto',
  padding: 16,
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  backgroundColor: '#f5f5f5'
});

const Message = styled(Box)(({ theme, isUser }) => ({
  display: 'flex',
  flexDirection: isUser ? 'row-reverse' : 'row',
  alignItems: 'flex-start',
  gap: 8,
  '& .message-bubble': {
    backgroundColor: isUser ? theme.palette.primary.main : theme.palette.background.paper,
    color: isUser ? theme.palette.primary.contrastText : theme.palette.text.primary,
    padding: '12px 16px',
    borderRadius: 16,
    maxWidth: '80%',
    wordWrap: 'break-word',
    boxShadow: theme.shadows[1],
    ...(isUser && {
      borderBottomRightRadius: 4
    }),
    ...(!isUser && {
      borderBottomLeftRadius: 4
    })
  }
}));

const InputContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  gap: theme.spacing(1),
  alignItems: 'flex-end',
  borderTop: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper
}));

// Простая функция без определения языка - всегда возвращает русский
const detectLanguage = () => {
  return 'ru';
};

// Мультиязычные ответы
const PRESET_RESPONSES = {
  ru: [
    'Рады, что обратились к нам! 😊 Наши специалисты уже работают над вашим вопросом.',
    'Спасибо за ваше сообщение! Мы ценим ваше доверие и обязательно поможем вам.',
    'Отлично! Ваш запрос принят. Наша команда специалистов спешит с ответом! ⚡',
    'Благодарим за обращение! Мы уже подключили к решению вашего вопроса наших экспертов.',
    'Замечательно! Ваше сообщение получено. Специалисты уже анализируют ситуацию. 🔍',
    'Прекрасно! Мы получили ваш запрос и уже начали работу над ним!'
  ],
  en: [
    'Glad you contacted us! 😊 Our specialists are already working on your question.',
    'Thank you for your message! We value your trust and will definitely help you.',
    'Excellent! Your request has been accepted. Our team of specialists is rushing to respond! ⚡',
    'Thank you for contacting us! We have already connected our experts to solve your question.',
    'Wonderful! Your message has been received. Specialists are already analyzing the situation. 🔍',
    'Perfect! We have received your request and have already started working on it!'
  ],
  es: [
    '¡Nos alegra que nos contacten! 😊 Nuestros especialistas ya están trabajando en su consulta.',
    '¡Gracias por su mensaje! Valoramos su confianza y definitivamente les ayudaremos.',
    '¡Excelente! Su solicitud ha sido aceptada. ¡Nuestro equipo de especialistas se apresura a responder! ⚡',
    '¡Gracias por contactarnos! Ya hemos conectado a nuestros expertos para resolver su pregunta.',
    '¡Maravilloso! Su mensaje ha sido recibido. Los especialistas ya están analizando la situación. 🔍',
    '¡Perfecto! Hemos recibido su solicitud y ya hemos comenzado a trabajar en ella!'
  ],
  tr: [
    'Bizimle iletişime geçtiğiniz için memnunuz! 😊 Uzmanlarımız sorunuz üzerinde çalışmaya başladı.',
    'Mesajınız için teşekkür ederiz! Güveninizi değerli buluyoruz ve size kesinlikle yardımcı olacağız.',
    'Mükemmel! Talebiniz kabul edildi. Uzman ekibimiz yanıtlamak için acele ediyor! ⚡',
    'Bizimle iletişime geçtiğiniz için teşekkürler! Sorunuzu çözmek için uzmanlarımızı görevlendirdik.',
    'Harika! Mesajınız alındı. Uzmanlar durumu analiz etmeye başladı. 🔍',
    'Mükemmel! Talebinizi aldık ve üzerinde çalışmaya başladık!'
  ],
  de: [
    'Freut uns, dass Sie uns kontaktiert haben! 😊 Unsere Spezialisten arbeiten bereits an Ihrer Anfrage.',
    'Vielen Dank für Ihre Nachricht! Wir schätzen Ihr Vertrauen und werden Ihnen definitiv helfen.',
    'Ausgezeichnet! Ihre Anfrage wurde angenommen. Unser Spezialistenteam beeilt sich zu antworten! ⚡',
    'Danke, dass Sie uns kontaktiert haben! Wir haben bereits unsere Experten beauftragt, Ihre Frage zu lösen.',
    'Wunderbar! Ihre Nachricht wurde erhalten. Die Spezialisten analysieren bereits die Situation. 🔍',
    'Perfekt! Wir haben Ihre Anfrage erhalten und bereits mit der Bearbeitung begonnen!'
  ],
  it: [
    'Siamo felici che ci abbiate contattato! 😊 I nostri specialisti stanno già lavorando sulla vostra domanda.',
    'Grazie per il vostro messaggio! Apprezziamo la vostra fiducia e vi aiuteremo sicuramente.',
    'Eccellente! La vostra richiesta è stata accettata. Il nostro team di specialisti si affretta a rispondere! ⚡',
    'Grazie per averci contattato! Abbiamo già coinvolto i nostri esperti per risolvere la vostra domanda.',
    'Meraviglioso! Il vostro messaggio è stato ricevuto. Gli specialisti stanno già analizzando la situazione. 🔍',
    'Perfetto! Abbiamo ricevuto la vostra richiesta e abbiamo già iniziato a lavorarci!'
  ],
  pt: [
    'Ficamos felizes por nos contactarem! 😊 Os nossos especialistas já estão a trabalhar na vossa pergunta.',
    'Obrigado pela vossa mensagem! Valorizamos a vossa confiança e definitivamente vos ajudaremos.',
    'Excelente! O vosso pedido foi aceite. A nossa equipa de especialistas apressa-se a responder! ⚡',
    'Obrigado por nos contactarem! Já envolvemos os nossos peritos para resolver a vossa pergunta.',
    'Maravilhoso! A vossa mensagem foi recebida. Os especialistas já estão a analisar a situação. 🔍',
    'Perfeito! Recebemos o vosso pedido e já começámos a trabalhar nele!'
  ],
  nl: [
    'Blij dat jullie ons hebben gecontacteerd! 😊 Onze specialisten werken al aan jullie vraag.',
    'Dank je voor je bericht! We waarderen jullie vertrouwen en zullen jullie zeker helpen.',
    'Uitstekend! Jullie verzoek is geaccepteerd. Ons team van specialisten haast zich om te antwoorden! ⚡',
    'Bedankt voor het contact! We hebben al onze experts betrokken om jullie vraag op te lossen.',
    'Geweldig! Jullie bericht is ontvangen. De specialisten analyseren de situatie al. 🔍',
    'Perfect! We hebben jullie verzoek ontvangen en zijn er al mee begonnen!'
  ],
  ja: [
    'お問い合わせいただき、ありがとうございます！😊 専門スタッフがすでにご質問に取り組んでおります。',
    'メッセージをありがとうございます！お客様の信頼を大切にし、必ずお手伝いいたします。',
    '素晴らしい！ご依頼を承りました。専門チームが急いで対応いたします！⚡',
    'お問い合わせありがとうございます！ご質問解決のため、専門家を配置いたしました。',
    '素晴らしい！メッセージを受信いたしました。専門スタッフが状況を分析中です。🔍',
    '完璧です！ご依頼を受け、すでに作業を開始しております！'
  ],
  ko: [
    '문의해 주셔서 기쁩니다! 😊 저희 전문가들이 이미 귀하의 질문에 대해 작업하고 있습니다.',
    '메시지 감사합니다! 귀하의 신뢰를 소중히 여기며 반드시 도움을 드리겠습니다.',
    '훌륭합니다! 귀하의 요청이 접수되었습니다. 저희 전문가 팀이 빠르게 응답하고 있습니다! ⚡',
    '문의해 주셔서 감사합니다! 귀하의 질문 해결을 위해 이미 전문가를 배정했습니다.',
    '멋집니다! 귀하의 메시지를 받았습니다. 전문가들이 이미 상황을 분석하고 있습니다. 🔍',
    '완벽합니다! 귀하의 요청을 받았으며 이미 작업을 시작했습니다!'
  ],
  he: [
    'שמחים שפניתם אלינו! 😊 המומחים שלנו כבר עובדים על השאלה שלכם.',
    'תודה על ההודעה שלכם! אנחנו מעריכים את האמון שלכם ובהחלט נעזור לכם.',
    'מעולה! הבקשה שלכם התקבלה. צוות המומחים שלנו ממהר להגיב! ⚡',
    'תודה שפניתם אלינו! כבר שילבנו את המומחים שלנו לפתרון השאלה שלכם.',
    'נפלא! ההודעה שלכם התקבלה. המומחים כבר מנתחים את המצב. 🔍',
    'מושלם! קיבלנו את הבקשה שלכם וכבר התחלנו לעבוד עליה!'
  ],
  hi: [
    'हमसे संपर्क करने के लिए खुशी है! 😊 हमारे विशेषज्ञ पहले से ही आपके प्रश्न पर काम कर रहे हैं।',
    'आपके संदेश के लिए धन्यवाद! हम आपके भरोसे की कदर करते हैं और निश्चित रूप से आपकी मदद करेंगे।',
    'उत्कृष्ट! आपका अनुरोध स्वीकार कर लिया गया है। हमारी विशेषज्ञ टीम जवाब देने के लिए जल्दी कर रही है! ⚡',
    'हमसे संपर्क करने के लिए धन्यवाद! हमने आपके प्रश्न को हल करने के लिए पहले से ही अपने विशेषज्ञों को शामिल किया है।',
    'अद्भुत! आपका संदेश प्राप्त हो गया है। विशेषज्ञ पहले से ही स्थिति का विश्लेषण कर रहे हैं। 🔍',
    'बिल्कुल सही! हमें आपका अनुरोध मिल गया है और हमने पहले से ही इस पर काम करना शुरू कर दिया है!'
  ],
  uk: [
    'Раді, що ви звернулися до нас! 😊 Наші спеціалісти вже працюють над вашим питанням.',
    'Дякуємо за ваше повідомлення! Ми цінуємо вашу довіру і обов\'язково допоможемо вам.',
    'Відмінно! Ваш запит прийнято. Наша команда спеціалістів поспішає з відповіддю! ⚡',
    'Дякуємо за звернення! Ми вже залучили наших експертів для вирішення вашого питання.',
    'Чудово! Ваше повідомлення отримано. Спеціалісти вже аналізують ситуацію. 🔍',
    'Прекрасно! Ми отримали ваш запит і вже почали над ним працювати!'
  ],
  zh: [
    '很高兴您联系我们！😊 我们的专家已经在处理您的问题了。',
    '感谢您的留言！我们珍视您的信任，一定会帮助您。',
    '太好了！您的请求已被接受。我们的专家团队正在加紧回复！⚡',
    '感谢您的联系！我们已经安排专家来解决您的问题。',
    '太棒了！我们已收到您的消息。专家们正在分析情况。🔍',
    '完美！我们已收到您的请求，并已开始处理！'
  ],
  ar: [
    'يسعدنا تواصلكم معنا! 😊 خبراؤنا يعملون بالفعل على استفساركم.',
    'شكراً لرسالتكم! نحن نقدر ثقتكم وسنساعدكم بالتأكيد.',
    'ممتاز! تم قبول طلبكم. فريق الخبراء لدينا يسارع للرد! ⚡',
    'شكراً لتواصلكم معنا! لقد أشركنا خبراءنا لحل استفساركم.',
    'رائع! تم استلام رسالتكم. الخبراء يحللون الوضع الآن. 🔍',
    'مثالي! تلقينا طلبكم وبدأنا العمل عليه بالفعل!'
  ],
  fr: [
    'Ravi que vous nous contactiez ! 😊 Nos spécialistes travaillent déjà sur votre question.',
    'Merci pour votre message ! Nous apprécions votre confiance et vous aiderons certainement.',
    'Excellent ! Votre demande a été acceptée. Notre équipe de spécialistes se dépêche de répondre ! ⚡',
    'Merci de nous avoir contactés ! Nous avons déjà mobilisé nos experts pour résoudre votre question.',
    'Formidable ! Votre message a été reçu. Les spécialistes analysent déjà la situation. 🔍',
    'Parfait ! Nous avons reçu votre demande et avons déjà commencé à travailler dessus !'
  ],
  pl: [
    'Cieszymy się, że się z nami skontaktowali! 😊 Nasi specjaliści już pracują nad Państwa pytaniem.',
    'Dziękujemy za wiadomość! Cenimy Państwa zaufanie i na pewno pomożemy.',
    'Doskonale! Państwa prośba została przyjęta. Nasz zespół specjalistów śpieszy z odpowiedzią! ⚡',
    'Dziękujemy za kontakt! Już włączyliśmy naszych ekspertów do rozwiązania Państwa pytania.',
    'Wspaniale! Państwa wiadomość została odebrana. Specjaliści już analizują sytuację. 🔍',
    'Idealnie! Otrzymaliśmy Państwa prośbę i już zaczęliśmy nad nią pracować!'
  ],
  cs: [
    'Jsme rádi, že jste nás kontaktovali! 😊 Naši specialisté již pracují na vaší otázce.',
    'Děkujeme za vaši zprávu! Vážíme si vaší důvěry a určitě vám pomůžeme.',
    'Výborně! Vaše žádost byla přijata. Náš tým specialistů se spěchá odpovědět! ⚡',
    'Děkujeme, že jste nás kontaktovali! Již jsme zapojili naše experty k vyřešení vaší otázky.',
    'Skvělé! Vaše zpráva byla přijata. Specialisté již analyzují situaci. 🔍',
    'Perfektní! Obdrželi jsme vaši žádost a již jsme na ní začali pracovat!'
  ],
  da: [
    'Glæder os over, at I har kontaktet os! 😊 Vores specialister arbejder allerede på jeres spørgsmål.',
    'Tak for jeres besked! Vi værdsætter jeres tillid og vil bestemt hjælpe jer.',
    'Fremragende! Jeres anmodning er blevet accepteret. Vores team af specialister skynder sig at svare! ⚡',
    'Tak for at kontakte os! Vi har allerede involveret vores eksperter til at løse jeres spørgsmål.',
    'Vidunderligt! Jeres besked er modtaget. Specialisterne analyserer allerede situationen. 🔍',
    'Perfekt! Vi har modtaget jeres anmodning og er allerede begyndt at arbejde på den!'
  ],
  fi: [
    'Iloisia, että otitte yhteyttä! 😊 Asiantuntijamme työskentelevät jo kysymyksenne parissa.',
    'Kiitos viestistänne! Arvostamme luottamustanne ja autamme teitä varmasti.',
    'Erinomaista! Pyyntönne on hyväksytty. Asiantuntijatiimimme kiirehtii vastaamaan! ⚡',
    'Kiitos yhteydenotosta! Olemme jo ottaneet asiantuntijamme mukaan kysymyksenne ratkaisemiseen.',
    'Mahtavaa! Viestinne on vastaanotettu. Asiantuntijat analysoivat jo tilannetta. 🔍',
    'Täydellistä! Saimme pyyntönne ja olemme jo alkaneet työskennellä sen parissa!'
  ],
  el: [
    'Χαιρόμαστε που επικοινωνήσατε μαζί μας! 😊 Οι ειδικοί μας εργάζονται ήδη στην ερώτησή σας.',
    'Ευχαριστούμε για το μήνυμά σας! Εκτιμούμε την εμπιστοσύνη σας και σίγουρα θα σας βοηθήσουμε.',
    'Εξαιρετικό! Το αίτημά σας έγινε δεκτό. Η ομάδα ειδικών μας βιάζεται να απαντήσει! ⚡',
    'Ευχαριστούμε που επικοινωνήσατε! Έχουμε ήδη εμπλέξει τους ειδικούς μας για να λύσουμε την ερώτησή σας.',
    'Υπέροχα! Το μήνυμά σας παραλήφθηκε. Οι ειδικοί αναλύουν ήδη την κατάσταση. 🔍',
    'Τέλεια! Λάβαμε το αίτημά σας και έχουμε ήδη αρχίσει να εργαζόμαστε πάνω του!'
  ],
  hu: [
    'Örülünk, hogy kapcsolatba léptek velünk! 😊 Szakértőink már dolgoznak a kérdéseteken.',
    'Köszönjük az üzeneteteket! Értékeljük a bizalmatokat és biztosan segítünk nektek.',
    'Kiváló! A kérésetek elfogadásra került. Szakértői csapatunk siet válaszolni! ⚡',
    'Köszönjük, hogy kapcsolatba léptetek! Már bevontuk szakértőinket a kérdésetek megoldásába.',
    'Csodálatos! Az üzeneteteket megkaptuk. A szakértők már elemzik a helyzetet. 🔍',
    'Tökéletes! Megkaptuk a kéréseteteket és már elkezdtünk dolgozni rajta!'
  ],
  no: [
    'Glade for at dere kontaktet oss! 😊 Våre spesialister jobber allerede med spørsmålet deres.',
    'Takk for meldingen deres! Vi setter pris på tilliten deres og vil definitivt hjelpe dere.',
    'Utmerket! Forespørselen deres har blitt akseptert. Vårt team av spesialister haster med å svare! ⚡',
    'Takk for at dere kontaktet oss! Vi har allerede involvert våre eksperter for å løse spørsmålet deres.',
    'Fantastisk! Meldingen deres er mottatt. Spesialistene analyserer allerede situasjonen. 🔍',
    'Perfekt! Vi har mottatt forespørselen deres og har allerede begynt å jobbe med den!'
  ],
  ro: [
    'Ne bucurăm că ne-ați contactat! 😊 Specialiștii noștri lucrează deja la întrebarea dumneavoastră.',
    'Mulțumim pentru mesajul dumneavoastră! Apreciem încrederea dumneavoastră și cu siguranță vă vom ajuta.',
    'Excelent! Cererea dumneavoastră a fost acceptată. Echipa noastră de specialiști se grăbește să răspundă! ⚡',
    'Mulțumim că ne-ați contactat! Am implicat deja experții noștri pentru a rezolva întrebarea dumneavoastră.',
    'Minunat! Mesajul dumneavoastră a fost primit. Specialiștii analizează deja situația. 🔍',
    'Perfect! Am primit cererea dumneavoastră și am început deja să lucrăm la ea!'
  ],
  sv: [
    'Glada att ni kontaktade oss! 😊 Våra specialister arbetar redan med er fråga.',
    'Tack för ert meddelande! Vi uppskattar ert förtroende och kommer definitivt att hjälpa er.',
    'Utmärkt! Er förfrågan har accepterats. Vårt team av specialister skyndar sig att svara! ⚡',
    'Tack för att ni kontaktade oss! Vi har redan involverat våra experter för att lösa er fråga.',
    'Underbart! Ert meddelande har mottagits. Specialisterna analyserar redan situationen. 🔍',
    'Perfekt! Vi har mottagit er förfrågan och har redan börjat arbeta med den!'
  ],
  th: [
    'ดีใจที่คุณติดต่อเรา! 😊 ผู้เชี่ยวชาญของเรากำลังทำงานกับคำถามของคุณแล้ว',
    'ขอบคุณสำหรับข้อความของคุณ! เราให้ความสำคัญกับความไว้วางใจของคุณและจะช่วยเหลือคุณอย่างแน่นอน',
    'ยอดเยี่ยม! คำขอของคุณได้รับการยอมรับแล้ว ทีมผู้เชี่ยวชาญของเรากำลังรีบตอบกลับ! ⚡',
    'ขอบคุณที่ติดต่อเรา! เราได้เชิญผู้เชี่ยวชาญของเรามาช่วยแก้ไขคำถามของคุณแล้ว',
    'ยอดเยี่ยม! ข้อความของคุณได้รับแล้ว ผู้เชี่ยวชาญกำลังวิเคราะห์สถานการณ์อยู่ 🔍',
    'สมบูรณ์แบบ! เราได้รับคำขอของคุณและเริ่มทำงานแล้ว!'
  ],
  vi: [
    'Rất vui khi bạn liên hệ với chúng tôi! 😊 Các chuyên gia của chúng tôi đã đang làm việc với câu hỏi của bạn.',
    'Cảm ơn tin nhắn của bạn! Chúng tôi đánh giá cao sự tin tưởng của bạn và chắc chắn sẽ giúp đỡ bạn.',
    'Tuyệt vời! Yêu cầu của bạn đã được chấp nhận. Đội ngũ chuyên gia của chúng tôi đang vội vã trả lời! ⚡',
    'Cảm ơn bạn đã liên hệ! Chúng tôi đã huy động các chuyên gia để giải quyết câu hỏi của bạn.',
    'Tuyệt vời! Tin nhắn của bạn đã được nhận. Các chuyên gia đang phân tích tình hình. 🔍',
    'Hoàn hảo! Chúng tôi đã nhận được yêu cầu của bạn và đã bắt đầu làm việc!'
  ],
  bg: [
    'Радваме се, че се свързахте с нас! 😊 Нашите специалисти вече работят по вашия въпрос.',
    'Благодарим за съобщението ви! Ценим доверието ви и определено ще ви помогнем.',
    'Отлично! Заявката ви беше приета. Нашият екип от специалисти бърза да отговори! ⚡',
    'Благодарим, че се свързахте с нас! Вече включихме нашите експерти за решаване на въпроса ви.',
    'Прекрасно! Съобщението ви беше получено. Специалистите вече анализират ситуацията. 🔍',
    'Перфектно! Получихме заявката ви и вече започнахме да работим по нея!'
  ],
  sr: [
    'Драго нам је што сте нас контактирали! 😊 Наши стручњаци већ раде на вашем питању.',
    'Хвала на вашој поруци! Ценимо ваше поверење и дефинитивно ћемо вам помоћи.',
    'Одлично! Ваш захтев је прихваћен. Наш тим стручњака жури да одговори! ⚡',
    'Хвала што сте нас контактирали! Већ смо укључили наше експерте да реше ваше питање.',
    'Дивно! Ваша порука је примљена. Стручњаци већ анализирају ситуацију. 🔍',
    'Савршено! Примили смо ваш захтев и већ смо почели да радимо на њему!'
  ],
  sk: [
    'Tešíme sa, že ste nás kontaktovali! 😊 Naši špecialisti už pracujú na vašej otázke.',
    'Ďakujeme za vašu správu! Vážime si vašu dôveru a určite vám pomôžeme.',
    'Výborne! Vaša žiadosť bola prijatá. Náš tím špecializovaných odborníkov sa ponáhľa odpovedať! ⚡',
    'Ďakujeme, že ste nás kontaktovali! Už sme zapojili našich expertov na vyriešenie vašej otázky.',
    'Skvelé! Vaša správa bola prijatá. Špecialisti už analyzujú situáciu. 🔍',
    'Perfektné! Dostali sme vašu žiadosť a už sme na nej začali pracovať!'
  ],
  sl: [
    'Veseli smo, da ste nas kontaktirali! 😊 Naši strokovnjaki že delajo na vašem vprašanju.',
    'Hvala za vaše sporočilo! Cenimo vaše zaupanje in vam bomo zagotovo pomagali.',
    'Odlično! Vaša zahteva je bila sprejeta. Naša ekipa strokovnjakov se mudi z odgovorom! ⚡',
    'Hvala, da ste nas kontaktirali! Že smo vključili naše strokovnjake za rešitev vašega vprašanja.',
    'Čudovito! Vaše sporočilo je bilo prejeto. Strokovnjaki že analizirajo situacijo. 🔍',
    'Popolno! Prejeli smo vašo zahtevo in že smo začeli delati na njej!'
  ]
};

// Сообщение о занятости специалистов (показывается после 5-го сообщения)
const BUSY_SPECIALISTS_MESSAGE = {
  ru: 'К сожалению, наши специалисты заняты из-за большой нагрузки. Пожалуйста, заполните форму обращения в конце сайта для получения персональной консультации. 📋',
  en: 'Unfortunately, our specialists are busy due to high workload. Please fill out the contact form at the end of the site for personalized consultation. 📋',
  es: 'Lamentablemente, nuestros especialistas están ocupados debido a la alta carga de trabajo. Por favor, completen el formulario de contacto al final del sitio para una consulta personalizada. 📋',
  tr: 'Maalesef, uzmanlarımız yoğun iş yükü nedeniyle meşguller. Kişiselleştirilmiş danışmanlık için lütfen sitenin sonundaki iletişim formunu doldurun. 📋',
  de: 'Leider sind unsere Spezialisten aufgrund hoher Arbeitsbelastung beschäftigt. Bitte füllen Sie das Kontaktformular am Ende der Website für eine persönliche Beratung aus. 📋',
  it: 'Purtroppo, i nostri specialisti sono occupati a causa dell\'alto carico di lavoro. Per favore, compilate il modulo di contatto alla fine del sito per una consulenza personalizzata. 📋',
  pt: 'Infelizmente, nossos especialistas estão ocupados devido à alta carga de trabalho. Por favor, preencham o formulário de contato no final do site para consulta personalizada. 📋',
  nl: 'Helaas zijn onze specialisten bezig vanwege de hoge werkdruk. Vul het contactformulier aan het einde van de site in voor persoonlijk advies. 📋',
  ja: '申し訳ございませんが、専門スタッフは業務量が多いため対応中です。個別相談については、サイト末尾のお問い合わせフォームにご記入ください。📋',
  ko: '죄송하지만 업무량이 많아 전문가들이 바쁩니다. 개인 상담을 위해 사이트 끝에 있는 문의 양식을 작성해 주세요. 📋',
  he: 'למרבה הצער, המומחים שלנו עסוקים בגלל עומס עבודה גבוה. אנא מלאו את טופס הפנייה בסוף האתר לקבלת ייעוץ אישי. 📋',
  hi: 'खुशी की बात है कि हमारे विशेषज्ञ अधिक कार्यभार के कारण व्यस्त हैं। व्यक्तिगत परामर्श के लिए कृपया साइट के अंत में संपर्क फॉर्म भरें। 📋',
  uk: 'На жаль, наші спеціалісти зайняті через велике навантаження. Будь ласка, заповніть форму звернення в кінці сайту для отримання персональної консультації. 📋',
  zh: '很抱歉，我们的专家由于工作量大而忙碌。请填写网站末尾的联系表格以获得个性化咨询。📋',
  ar: 'للأسف، خبراؤنا مشغولون بسبب ضغط العمل الكبير. يرجى ملء نموذج الاتصال في نهاية الموقع للحصول على استشارة شخصية. 📋',
  fr: 'Malheureusement, nos spécialistes sont occupés en raison d\'une forte charge de travail. Veuillez remplir le formulaire de contact à la fin du site pour une consultation personnalisée. 📋',
  pl: 'Niestety, nasi specjaliści są zajęci z powodu dużego obciążenia pracą. Proszę wypełnić formularz kontaktowy na końcu strony, aby uzyskać spersonalizowaną konsultację. 📋',
  cs: 'Bohužel jsou naši specialisté zaneprázdněni kvůli vysoké pracovní zátěži. Prosím vyplňte kontaktní formulář na konci stránky pro personalizovanou konzultaci. 📋',
  da: 'Desværre er vores specialister optaget på grund af høj arbejdsbyrde. Udfyld venligst kontaktformularen i slutningen af siden for personlig rådgivning. 📋',
  fi: 'Valitettavasti asiantuntijamme ovat kiireisiä suuren työmäärän vuoksi. Täyttäkää yhteystietolomake sivun lopussa henkilökohtaista neuvontaa varten. 📋',
  el: 'Δυστυχώς, οι ειδικοί μας είναι απασχολημένοι λόγω μεγάλου φόρτου εργασίας. Παρακαλώ συμπληρώστε τη φόρμα επικοινωνίας στο τέλος του ιστότοπου για εξατομικευμένη συμβουλευτική. 📋',
  hu: 'Sajnos szakértőink elfoglaltak a nagy munkaterhelés miatt. Kérjük, töltse ki a kapcsolatfelvételi űrlapot az oldal végén személyre szabott tanácsadásért. 📋',
  no: 'Dessverre er våre spesialister opptatt på grunn av høy arbeidsmengde. Vennligst fyll ut kontaktskjemaet på slutten av siden for personlig rådgivning. 📋',
  ro: 'Din păcate, specialiștii noștri sunt ocupați din cauza volumului mare de muncă. Vă rugăm să completați formularul de contact de la sfârșitul site-ului pentru consultanță personalizată. 📋',
  sv: 'Tyvärr är våra specialister upptagna på grund av hög arbetsbelastning. Vänligen fyll i kontaktformuläret i slutet av sidan för personlig rådgivning. 📋',
  th: 'ขออภัย ผู้เชี่ยวชาญของเรายุ่งเนื่องจากภาระงานที่มาก กรุณากรอกแบบฟอร์มติดต่อที่ท้ายเว็บไซต์เพื่อรับคำปรึกษาเฉพาะบุคคล 📋',
  vi: 'Rất tiếc, các chuyên gia của chúng tôi đang bận rộn do khối lượng công việc lớn. Vui lòng điền vào biểu mẫu liên hệ ở cuối trang web để được tư vấn cá nhân. 📋',
  bg: 'За съжаление, нашите специалисти са заети поради голямото натоварване. Моля, попълнете формуляра за контакт в края на сайта за персонализирана консултация. 📋',
  sr: 'Нажалост, наши стручњаци су заузети због великог оптерећења. Молимо попуните контакт форму на крају сајта за персонализовано саветовање. 📋',
  sk: 'Bohužiaľ, naši špecialisti sú zaneprázdnení kvôli vysokému pracovnému zaťaženiu. Prosím vyplňte kontaktný formulár na konci stránky pre personalizované poradenstvo. 📋',
  sl: 'Žal so naši strokovnjaki zasedeni zaradi velike obremenitve z delom. Prosimo, izpolnite kontaktni obrazec na koncu strani za osebno svetovanje. 📋'
};

const FINAL_RESPONSE = {
  ru: 'Если наш специалист чата пока не связался с вами, пожалуйста, заполните форму обратной связи внизу сайта 📝 - мы обязательно свяжемся с вами в ближайшее время!',
  en: 'If our chat specialist has not contacted you yet, please fill out the feedback form at the bottom of the site 📝 - we will definitely contact you soon!',
  es: 'Si nuestro especialista de chat aún no se ha puesto en contacto con ustedes, por favor completen el formulario de contacto en la parte inferior del sitio 📝 - ¡definitivamente nos pondremos en contacto pronto!',
  tr: 'Sohbet uzmanımız henüz sizinle iletişime geçmediyse, lütfen sitenin alt kısmındaki iletişim formunu doldurun 📝 - kesinlikle yakında sizinle iletişime geçeceğiz!',
  zh: '如果我们的聊天专家还没有联系您，请填写网站底部的反馈表格 📝 - 我们会尽快与您联系！',
  ar: 'إذا لم يتواصل معكم أخصائي الدردشة بعد، يرجى ملء نموذج التواصل في أسفل الموقع 📝 - سنتواصل معكم قريباً!',
  fr: 'Si notre spécialiste du chat ne vous a pas encore contacté, veuillez remplir le formulaire de contact en bas du site 📝 - nous vous contacterons bientôt !',
  pl: 'Jeśli nasz specjalista czatu jeszcze się z Państwem nie skontaktował, proszę wypełnić formularz kontaktowy na dole strony 📝 - na pewno skontaktujemy się z Państwem wkrótce!'
};

const WELCOME_MESSAGE = {
  ru: 'Привет! Я виртуальный помощник {siteName}. Чем могу помочь? 👋',
  en: 'Hello! I am {siteName} virtual assistant. How can I help you? 👋',
  es: '¡Hola! Soy el asistente virtual de {siteName}. ¿En qué puedo ayudarles? 👋',
  tr: 'Merhaba! Ben {siteName} sanal asistanıyım. Size nasıl yardımcı olabilirim? 👋',
  zh: '您好！我是 {siteName} 的虚拟助手。我能为您做些什么？👋',
  ar: 'مرحباً! أنا المساعد الافتراضي لـ {siteName}. كيف يمكنني مساعدتكم؟ 👋',
  fr: 'Bonjour ! Je suis l\'assistant virtuel de {siteName}. Comment puis-je vous aider ? 👋',
  pl: 'Witam! Jestem wirtualnym asystentem {siteName}. Jak mogę Państwu pomóc? 👋'
};

const PLACEHOLDERS = {
  ru: {
    default: 'Напишите ваше сообщение...',
    finished: 'Чат завершен. Заполните форму на сайте'
  },
  en: {
    default: 'Type your message...',
    finished: 'Chat finished. Fill out the form on the site'
  },
  es: {
    default: 'Escriba su mensaje...',
    finished: 'Chat terminado. Complete el formulario en el sitio'
  },
  tr: {
    default: 'Mesajınızı yazın...',
    finished: 'Sohbet bitti. Sitedeki formu doldurun'
  },
  zh: {
    default: '请输入您的消息...',
    finished: '聊天已结束。请填写网站表格'
  },
  ar: {
    default: 'اكتبوا رسالتكم...',
    finished: 'انتهت المحادثة. املؤوا النموذج في الموقع'
  },
  fr: {
    default: 'Tapez votre message...',
    finished: 'Chat terminé. Remplissez le formulaire sur le site'
  },
  pl: {
    default: 'Napisz swoją wiadomość...',
    finished: 'Czat zakończony. Wypełnij formularz na stronie'
  }
};

const STATUS_MESSAGE = {
  ru: '💡 Для дальнейшей помощи заполните форму на сайте',
  en: '💡 For further assistance, fill out the form on the site',
  es: '💡 Para obtener más ayuda, complete el formulario en el sitio',
  tr: '💡 Daha fazla yardım için sitedeki formu doldurun',
  zh: '💡 如需进一步帮助，请填写网站表格',
  ar: '💡 للحصول على مساعدة إضافية، املؤوا النموذج في الموقع',
  fr: '💡 Pour une assistance supplémentaire, remplissez le formulaire sur le site',
  pl: '💡 Aby uzyskać dalszą pomoc, wypełnij formularz na stronie'
};

const TOOLTIP_MESSAGES = {
  ru: {
    send: 'Отправить',
    finished: 'Чат завершен'
  },
  en: {
    send: 'Send',
    finished: 'Chat finished'
  },
  es: {
    send: 'Enviar',
    finished: 'Chat terminado'
  },
  tr: {
    send: 'Gönder',
    finished: 'Sohbet bitti'
  },
  zh: {
    send: '发送',
    finished: '聊天已结束'
  },
  ar: {
    send: 'إرسال',
    finished: 'انتهت المحادثة'
  },
  fr: {
    send: 'Envoyer',
    finished: 'Chat terminé'
  },
  pl: {
    send: 'Wyślij',
    finished: 'Czat zakończony'
  }
};

const MESSAGE_LIMIT = 5; // Максимум сообщений от пользователя

// Локализация интерфейса
const getLocalization = (lang) => {
  const localizations = {
    ru: {
      title: 'Онлайн-чат',
      placeholder: 'Введите ваше сообщение...',
      sendButton: 'Отправить',
      finalMessage: 'Спасибо за обращение! Для получения подробной консультации, пожалуйста, заполните форму внизу страницы.',
      typing: 'печатает...'
    },
    en: {
      title: 'Live Chat',
      placeholder: 'Type your message...',
      sendButton: 'Send',
      finalMessage: 'Thank you for contacting us! For detailed consultation, please fill out the form at the bottom of the page.',
      typing: 'typing...'
    },
    es: {
      title: 'Chat en Vivo',
      placeholder: 'Escribe tu mensaje...',
      sendButton: 'Enviar',
      finalMessage: 'Gracias por contactarnos! Para una consulta detallada, por favor complete el formulario al final de la página.',
      typing: 'escribiendo...'
    },
    tr: {
      title: 'Canlı Sohbet',
      placeholder: 'Mesajınızı yazın...',
      sendButton: 'Gönder',
      finalMessage: 'Bizimle iletişime geçtiğiniz için teşekkürler! Detaylı danışmanlık için lütfen sayfanın altındaki formu doldurun.',
      typing: 'yazıyor...'
    },
    de: {
      title: 'Live-Chat',
      placeholder: 'Geben Sie Ihre Nachricht ein...',
      sendButton: 'Senden',
      finalMessage: 'Vielen Dank für Ihre Kontaktaufnahme! Für eine detaillierte Beratung füllen Sie bitte das Formular am Ende der Seite aus.',
      typing: 'tippt...'
    },
    it: {
      title: 'Chat dal Vivo',
      placeholder: 'Digita il tuo messaggio...',
      sendButton: 'Invia',
      finalMessage: 'Grazie per averci contattato! Per una consulenza dettagliata, compilate il modulo in fondo alla pagina.',
      typing: 'sta scrivendo...'
    },
    pt: {
      title: 'Chat ao Vivo',
      placeholder: 'Digite a sua mensagem...',
      sendButton: 'Enviar',
      finalMessage: 'Obrigado por nos contactar! Para uma consulta detalhada, preencham o formulário no final da página.',
      typing: 'a escrever...'
    },
    nl: {
      title: 'Live Chat',
      placeholder: 'Typ je bericht...',
      sendButton: 'Versturen',
      finalMessage: 'Bedankt voor jullie contact! Voor gedetailleerd advies, vul het formulier onderaan de pagina in.',
      typing: 'aan het typen...'
    },
    ja: {
      title: 'ライブチャット',
      placeholder: 'メッセージを入力してください...',
      sendButton: '送信',
      finalMessage: 'お問い合わせありがとうございます！詳細なご相談については、ページ下部のフォームにご記入ください。',
      typing: '入力中...'
    },
    ko: {
      title: '실시간 채팅',
      placeholder: '메시지를 입력하세요...',
      sendButton: '전송',
      finalMessage: '문의해 주셔서 감사합니다! 자세한 상담을 위해 페이지 하단의 양식을 작성해 주세요.',
      typing: '입력 중...'
    },
    he: {
      title: 'צ\'אט חי',
      placeholder: 'הקלידו את ההודעה שלכם...',
      sendButton: 'שלח',
      finalMessage: 'תודה שפניתם אלינו! לייעוץ מפורט, אנא מלאו את הטופס בתחתית העמוד.',
      typing: 'מקליד...'
    },
    hi: {
      title: 'लाइव चैट',
      placeholder: 'अपना संदेश टाइप करें...',
      sendButton: 'भेजें',
      finalMessage: 'हमसे संपर्क करने के लिए धन्यवाद! विस्तृत परामर्श के लिए, कृपया पृष्ठ के नीचे फॉर्म भरें।',
      typing: 'टाइप कर रहे हैं...'
    },
    uk: {
      title: 'Онлайн-чат',
      placeholder: 'Введіть ваше повідомлення...',
      sendButton: 'Надіслати',
      finalMessage: 'Дякуємо за звернення! Для отримання детальної консультації, будь ласка, заповніть форму внизу сторінки.',
      typing: 'друкує...'
    },
    cs: {
      title: 'Live Chat',
      placeholder: 'Napište svou zprávu...',
      sendButton: 'Odeslat',
      finalMessage: 'Děkujeme za kontakt! Pro podrobnou konzultaci vyplňte prosím formulář na konci stránky.',
      typing: 'píše...'
    },
    da: {
      title: 'Live Chat',
      placeholder: 'Skriv jeres besked...',
      sendButton: 'Send',
      finalMessage: 'Tak for jeres kontakt! For detaljeret rådgivning, udfyld venligst formularen nederst på siden.',
      typing: 'skriver...'
    },
    fi: {
      title: 'Live Chat',
      placeholder: 'Kirjoita viestinne...',
      sendButton: 'Lähetä',
      finalMessage: 'Kiitos yhteydenotosta! Yksityiskohtaista neuvontaa varten täyttäkää lomake sivun alaosassa.',
      typing: 'kirjoittaa...'
    },
    el: {
      title: 'Live Chat',
      placeholder: 'Γράψτε το μήνυμά σας...',
      sendButton: 'Αποστολή',
      finalMessage: 'Ευχαριστούμε για την επικοινωνία! Για λεπτομερή συμβουλή, παρακαλώ συμπληρώστε τη φόρμα στο κάτω μέρος της σελίδας.',
      typing: 'γράφει...'
    },
    hu: {
      title: 'Élő Chat',
      placeholder: 'Írjátok be az üzeneteteket...',
      sendButton: 'Küldés',
      finalMessage: 'Köszönjük a kapcsolatfelvételt! Részletes tanácsadásért töltsétek ki az oldal alján található űrlapot.',
      typing: 'ír...'
    },
    no: {
      title: 'Live Chat',
      placeholder: 'Skriv meldingen deres...',
      sendButton: 'Send',
      finalMessage: 'Takk for kontakten! For detaljert rådgivning, fyll ut skjemaet nederst på siden.',
      typing: 'skriver...'
    },
    ro: {
      title: 'Chat Live',
      placeholder: 'Scrieți mesajul dumneavoastră...',
      sendButton: 'Trimite',
      finalMessage: 'Mulțumim pentru contact! Pentru consultanță detaliată, completați formularul de la sfârșitul paginii.',
      typing: 'scrie...'
    },
    sv: {
      title: 'Live Chat',
      placeholder: 'Skriv ert meddelande...',
      sendButton: 'Skicka',
      finalMessage: 'Tack för er kontakt! För detaljerad rådgivning, fyll i formuläret längst ner på sidan.',
      typing: 'skriver...'
    },
    th: {
      title: 'แชทสด',
      placeholder: 'พิมพ์ข้อความของคุณ...',
      sendButton: 'ส่ง',
      finalMessage: 'ขอบคุณที่ติดต่อเรา! สำหรับคำปรึกษาโดยละเอียด กรุณากรอกแบบฟอร์มที่ด้านล่างของหน้า',
      typing: 'กำลังพิมพ์...'
    },
    vi: {
      title: 'Chat Trực Tuyến',
      placeholder: 'Nhập tin nhắn của bạn...',
      sendButton: 'Gửi',
      finalMessage: 'Cảm ơn bạn đã liên hệ! Để được tư vấn chi tiết, vui lòng điền vào biểu mẫu ở cuối trang.',
      typing: 'đang gõ...'
    },
    bg: {
      title: 'Чат на живо',
      placeholder: 'Напишете съобщението си...',
      sendButton: 'Изпрати',
      finalMessage: 'Благодарим за контакта! За подробна консултация, моля попълнете формуляра в долната част на страницата.',
      typing: 'пише...'
    },
    sr: {
      title: 'Чет уживо',
      placeholder: 'Упишите вашу поруку...',
      sendButton: 'Пошаљи',
      finalMessage: 'Хвала на контакту! За детаљно саветовање, молимо попуните формулар на дну странице.',
      typing: 'куца...'
    },
    sk: {
      title: 'Live Chat',
      placeholder: 'Napíšte svoju správu...',
      sendButton: 'Odeslať',
      finalMessage: 'Ďakujeme za kontakt! Pre podrobnú konzultáciu vyplňte formulár na konci stránky.',
      typing: 'píše...'
    },
    sl: {
      title: 'Klepet v živo',
      placeholder: 'Napišite svoje sporočilo...',
      sendButton: 'Pošlji',
      finalMessage: 'Hvala za stik! Za podrobno svetovanje izpolnite obrazec na dnu strani.',
      typing: 'piše...'
    },
    zh: {
      title: '在线聊天',
      placeholder: '输入您的消息...',
      sendButton: '发送',
      finalMessage: '感谢您的联系！如需详细咨询，请填写页面底部的表单。',
      typing: '正在输入...'
    },
    ar: {
      title: 'الدردشة المباشرة',
      placeholder: 'اكتبوا رسالتكم...',
      sendButton: 'إرسال',
      finalMessage: 'شكراً لتواصلكم معنا! للحصول على استشارة مفصلة، يرجى ملء النموذج في أسفل الصفحة.',
      typing: 'يكتب...'
    },
    fr: {
      title: 'Chat en Direct',
      placeholder: 'Tapez votre message...',
      sendButton: 'Envoyer',
      finalMessage: 'Merci de nous avoir contactés ! Pour une consultation détaillée, veuillez remplir le formulaire en bas de la page.',
      typing: 'tape...'
    },
    pl: {
      title: 'Chat na Żywo',
      placeholder: 'Wpisz swoją wiadomość...',
      sendButton: 'Wyślij',
      finalMessage: 'Dziękujemy za kontakt! Aby uzyskać szczegółową konsultację, wypełnij formularz na dole strony.',
      typing: 'pisze...'
    }
  };
  
  return localizations[lang] || localizations.ru;
};

// Функция форматирования времени с учетом локали
const formatTime = (date, locale) => {
  const localeMap = {
    ru: 'ru-RU',
    en: 'en-US', 
    es: 'es-ES',
    tr: 'tr-TR',
    de: 'de-DE',
    it: 'it-IT',
    pt: 'pt-PT',
    nl: 'nl-NL',
    ja: 'ja-JP',
    ko: 'ko-KR',
    he: 'he-IL',
    hi: 'hi-IN',
    uk: 'uk-UA',
    cs: 'cs-CZ',
    da: 'da-DK',
    fi: 'fi-FI',
    el: 'el-GR',
    hu: 'hu-HU',
    no: 'no-NO',
    ro: 'ro-RO',
    sv: 'sv-SE',
    th: 'th-TH',
    vi: 'vi-VN',
    bg: 'bg-BG',
    sr: 'sr-RS',
    sk: 'sk-SK',
    sl: 'sl-SI',
    zh: 'zh-CN',
    ar: 'ar-SA',
    fr: 'fr-FR',
    pl: 'pl-PL'
  };
  
  const browserLocale = localeMap[locale] || 'ru-RU';
  return date.toLocaleTimeString(browserLocale, { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

const LiveChatWidget = ({ siteName = 'Мой сайт' }) => {
  const [language, setLanguage] = useState('ru');
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userMessageCount, setUserMessageCount] = useState(0);
  const [usedResponses, setUsedResponses] = useState([]); // Отслеживаем использованные ответы
  const messagesEndRef = useRef(null);

  // Определяем язык при загрузке компонента
  useEffect(() => {
    const detectedLang = detectLanguage();
    setLanguage(detectedLang);
    
    // Устанавливаем приветственное сообщение
    const welcomeText = WELCOME_MESSAGE[detectedLang].replace('{siteName}', siteName);
    setMessages([{
      id: 1,
      text: welcomeText,
      isUser: false,
      timestamp: new Date()
    }]);
  }, [siteName]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getRandomResponse = () => {
    // После 6-го сообщения показываем финальный ответ
    if (userMessageCount > MESSAGE_LIMIT) {
      return FINAL_RESPONSE[language];
    }

    // После 5-го сообщения показываем сообщение о занятости специалистов
    if (userMessageCount === MESSAGE_LIMIT) {
      return BUSY_SPECIALISTS_MESSAGE[language];
    }

    const responses = PRESET_RESPONSES[language];
    // Выбираем ответ, который еще не использовался
    const availableResponses = responses.filter((_, index) => !usedResponses.includes(index));
    
    // Если все ответы использованы, сбрасываем список
    if (availableResponses.length === 0) {
      setUsedResponses([]);
      return responses[Math.floor(Math.random() * responses.length)];
    }

    // Выбираем случайный ответ из доступных
    const randomIndex = Math.floor(Math.random() * availableResponses.length);
    const selectedResponse = availableResponses[randomIndex];
    
    // Находим оригинальный индекс и добавляем в использованные
    const originalIndex = responses.indexOf(selectedResponse);
    setUsedResponses(prev => [...prev, originalIndex]);
    
    return selectedResponse;
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    // Проверяем лимит сообщений
    if (userMessageCount >= MESSAGE_LIMIT + 1) { // +1 чтобы показать финальное сообщение
      return;
    }

    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setUserMessageCount(prev => prev + 1);

    // Имитируем задержку ответа для реалистичности
        setTimeout(() => {
          const botResponse = {
        id: messages.length + 2,
        text: getRandomResponse(),
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsLoading(false);
    }, 1000 + Math.random() * 1500); // Случайная задержка 1-2.5 секунды
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Проверяем, можно ли отправлять сообщения
  const canSendMessage = userMessageCount < MESSAGE_LIMIT + 1 && !isLoading && inputValue.trim();

  return (
    <>
      <ChatFab 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Открыть чат"
      >
        {isOpen ? <CloseIcon /> : <ChatIcon />}
      </ChatFab>

      {isOpen && (
        <ChatWidget elevation={8}>
          <ChatHeader>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <BotIcon />
              <Typography variant="h6" sx={{ fontSize: '1rem' }}>
                {language === 'ru' ? `Поддержка ${siteName}` : 
                 language === 'zh' ? `${siteName} 支持` : 
                 language === 'ar' ? `${siteName} دعم` : 
                 language === 'fr' ? `${siteName} Support` : 
                 language === 'pl' ? `${siteName} Pomoc` : 
                 language === 'es' ? `${siteName} Soporte` : 
                 language === 'tr' ? `${siteName} Destek` :
                 `${siteName} Support`}
              </Typography>
            </Box>
            <IconButton 
              size="small" 
              onClick={() => setIsOpen(false)}
              sx={{ color: 'inherit' }}
            >
              <CloseIcon />
            </IconButton>
          </ChatHeader>

          <MessagesContainer>
            {messages.map((message) => (
              <Message key={message.id} isUser={message.isUser}>
                <Avatar 
                  sx={{ 
                    width: 32, 
                    height: 32,
                    fontSize: '0.8rem',
                    bgcolor: message.isUser ? 'primary.main' : 'grey.400'
                  }}
                >
                  {message.isUser ? (language === 'ru' ? 'У' : 
                                    language === 'zh' ? '您' : 
                                    language === 'ar' ? 'ه' : 
                                    language === 'fr' ? 'U' : 
                                    language === 'pl' ? 'U' : 
                                    language === 'es' ? 'U' : 
                                    language === 'tr' ? 'K' : 'U') : <BotIcon sx={{ fontSize: 18 }} />}
                </Avatar>
                <Box className="message-bubble">
                  <Typography variant="body2">
                    {message.text}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                    opacity: 0.7, 
                    fontSize: '0.7rem'
                  }}>
                    {formatTime(message.timestamp, language)}
                  </Typography>
                </Box>
              </Message>
            ))}
            {isLoading && (
              <Message isUser={false}>
                <Avatar 
                  src="/images/chat/operator.jpg"
                  sx={{ width: 32, height: 32, bgcolor: 'grey.300' }}
                >
                  <BotIcon sx={{ fontSize: 18 }} />
                </Avatar>
                <Box className="message-bubble">
                  <CircularProgress size={20} />
                </Box>
              </Message>
            )}
            <div ref={messagesEndRef} />
          </MessagesContainer>

          <InputContainer>
            <TextField
              fullWidth
              multiline
              maxRows={3}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                userMessageCount >= MESSAGE_LIMIT + 1 
                  ? PLACEHOLDERS[language].finished
                  : PLACEHOLDERS[language].default
              }
              variant="outlined"
              size="small"
              disabled={userMessageCount >= MESSAGE_LIMIT + 1 || isLoading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />
            <Tooltip title={
              userMessageCount >= MESSAGE_LIMIT + 1 
                ? TOOLTIP_MESSAGES[language].finished 
                : TOOLTIP_MESSAGES[language].send
            }>
              <IconButton 
                onClick={sendMessage}
                disabled={!canSendMessage}
                color="primary"
                sx={{ alignSelf: 'flex-end' }}
              >
                <SendIcon />
              </IconButton>
            </Tooltip>
          </InputContainer>

          {userMessageCount >= MESSAGE_LIMIT && (
            <Box sx={{ 
              p: 1, 
              bgcolor: 'info.light', 
              color: 'info.contrastText',
              fontSize: '0.75rem',
              textAlign: 'center'
            }}>
              {STATUS_MESSAGE[language]}
            </Box>
          )}
        </ChatWidget>
      )}
    </>
  );
};

export default LiveChatWidget; 