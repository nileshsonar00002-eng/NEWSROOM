import { Article } from '../types';

export const SEED_ARTICLES: Article[] = [
  {
    id: 'news-1',
    categoryId: 'technology',
    authorId: 'author-3',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    imageCaption: 'High-density microchip silicon wafer under inspection at a modern semiconductor fabrication laboratory.',
    imageCredit: 'NEWSORA Tech Bureau / Unsplash',
    sourceUrl: 'https://pib.gov.in',
    tags: ['Semiconductor', 'MakeInIndia', 'Technology', 'AI', 'Manufacturing'],
    isFeatured: true,
    isBreaking: true,
    isTrending: true,
    readingTimeMinutes: 4,
    viewCount: 3820,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    translations: {
      en: {
        title: 'India Unveils Commercial Silicon Fab Roadmap with Multi-Billion Dollar Ecosystem Investments',
        description: 'The national semiconductor mission enters its next pivotal phase with domestic packaging and fabrication facilities breaking ground in Gujarat and Maharashtra.',
        slug: 'india-unveils-commercial-silicon-fab-roadmap',
        status: 'published',
        seoTitle: 'India Commercial Silicon Fab Roadmap - Multi-Billion Dollar Tech Investments | NEWSORA',
        seoDescription: 'India launches domestic commercial semiconductor manufacturing units across key industrial clusters, boosting global tech supply resilience.',
        publishedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        content: `
          <p class="lead">India's ambitious drive towards domestic semiconductor sovereignty reached a historic turning point today with the ceremonial groundbreaking of three advanced packaging and fabrication facilities.</p>
          
          <h2>Building Strategic Resilience in High Technology</h2>
          <p>Global supply chain disruptions over recent years have underscored the non-negotiable imperative of semiconductor autonomy. With consumer electronics, electric vehicles, telecommunications, and defense systems heavily dependent on cutting-edge silicon, India's multi-billion dollar incentive framework is now translating into tangible physical infrastructure.</p>
          
          <blockquote>"We are moving from assembly and design to deep-tier manufacturing. This transforms our domestic capability and anchors India firmly within the global semiconductor value network." — National Tech Advisory Council</blockquote>
          
          <h2>Collaboration with Global Giants</h2>
          <p>Key partnerships with leading international technology consortiums will ensure workforce skill development across nano-engineering, precision lithography, and cleanroom maintenance. Over 50,000 direct and indirect specialized engineering jobs are estimated to be created over the next five years.</p>
          
          <h3>Key Highlights of the Roadmap:</h3>
          <ul>
            <li>Pilot 28nm and 40nm commercial foundry lines operational within 24 months.</li>
            <li>Advanced Outsourced Semiconductor Assembly and Test (OSAT) facilities.</li>
            <li>Clean energy integration with dedicated solar and water recycling infrastructure.</li>
            <li>Direct academic linkages with top IITs and engineering research institutes.</li>
          </ul>
        `
      },
      hi: {
        title: 'भारत ने वाणिज्यिक सेमीकंडक्टर फैब रोडमैप का किया अनावरण, अरबों डॉलर के निवेश से बदलेगा तकनीकी परिदृश्य',
        description: 'राष्ट्रीय सेमीकंडक्टर मिशन अपने महत्वपूर्ण चरण में पहुंचा; गुजरात और महाराष्ट्र में घरेलू चिप निर्माण व पैकेजिंग इकाइयों का शिलान्यास।',
        slug: 'india-unveils-commercial-silicon-fab-roadmap-hi',
        status: 'published',
        seoTitle: 'भारत सेमीकंडक्टर फैब रोडमैप - तकनीकी क्रांति | NEWSORA',
        seoDescription: 'भारत में सेमीकंडक्टर विनिर्माण को मिला नया आयाम, देश भर में स्थापित होंगी उन्नत चिप निर्माण इकाइयां।',
        publishedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        content: `
          <p class="lead">घरेलू सेमीकंडक्टर विनिर्माण में आत्मनिर्भरता की ओर भारत ने आज एक ऐतिहासिक कदम उठाया। देश में उन्नत चिप पैकेजिंग और फैब्रिकेशन सुविधाओं का कार्य तेजी से शुरू हो चुका है।</p>
          
          <h2>उच्च तकनीक में रणनीतिक आत्मनिर्भरता</h2>
          <p>हाल के वर्षों में वैश्विक आपूर्ति श्रृंखला की चुनौतियों ने चिप निर्माण की महत्ता को स्पष्ट कर दिया है। ऑटोमोबाइल, स्मार्टफोन, दूरसंचार और रक्षा उपकरण अब घरेलू तकनीक से समृद्ध होंगे।</p>
          
          <blockquote>"हम केवल डिजाइन तक सीमित नहीं रहेंगे, बल्कि निर्माण के क्षेत्र में वैश्विक स्तर पर अग्रणी भूमिका निभाएंगे।" — राष्ट्रीय सलाहकार परिषद</blockquote>
          
          <h2>प्रमुख बिंदु:</h2>
          <ul>
            <li>आगामी 24 महीनों में कमर्शियल फाउंड्री लाइन शुरू करने का लक्ष्य।</li>
            <li>हजारों युवा इंजीनियरों को अत्याधुनिक तकनीकी प्रशिक्षण।</li>
            <li>पर्यावरण अनुकूल हरित ऊर्जा और जल पुनर्चक्रण प्रणाली।</li>
          </ul>
        `
      },
      mr: {
        title: 'भारताचा ऐतिहासिक सेमीकंडक्टर रोडमॅप जाहीर; अब्जावधी डॉलर्सच्या गुंतवणुकीसह चिप निर्मितीला गती',
        description: 'राष्ट्रीय सेमीकंडक्टर मिशन अंतर्गत महाराष्ट्र आणि गुजरातमधील अत्याधुनिक फॅब्रिकेशन प्रकल्पांना सुरुवात; तंत्रज्ञान क्षेत्रात आत्मनिर्भरतेचे पाऊल.',
        slug: 'india-unveils-commercial-silicon-fab-roadmap-mr',
        status: 'published',
        seoTitle: 'भारताचा सेमीकंडक्टर रोडमॅप - तंत्रज्ञानातील ऐतिहासिक पाऊल | NEWSORA',
        seoDescription: 'भारतात चिप निर्मितीचे नवे युग सुरू, महाराष्ट्र आणि गुजरातमध्ये अत्याधुनिक कारखान्यांचे काम वेगाने सुरू.',
        publishedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        content: `
          <p class="lead">जागतिक तंत्रज्ञान क्षेत्रात भारताने स्वयंपूर्णतेच्या दिशेने एक मोठे पाऊल टाकले आहे. अत्याधुनिक सेमीकंडक्टर चिप निर्मिती आणि पॅकेजिंग प्रकल्पांच्या कामाला औपचारिक सुरुवात झाली आहे.</p>
          
          <h2>तंत्रज्ञान क्षेत्रातील ऐतिहासिक क्रांती</h2>
          <p>स्मार्टफोन, विद्युत वाहने, संरक्षण उपकरणे आणि दूरसंचार क्षेत्रासाठी आवश्यक असणाऱ्या मायक्रोचिप्स आता देशातच मोठ्या प्रमाणावर तयार केल्या जातील.</p>
          
          <blockquote>"डिझाईन क्षेत्रासोबतच आता उत्पादन क्षेत्रातही भारत जागतिक विश्वासार्ह भागीदार म्हणून पुढे येत आहे." — तांत्रिक तज्ज्ञ समिती</blockquote>
          
          <h2>महत्त्वाचे पैलू:</h2>
          <ul>
            <li>महाराष्ट्रात आणि गुजरातमध्ये अत्याधुनिक फॅब्रिकेशन युनिट्स.</li>
            <li>५०,००० हून अधिक उच्चकुशल रोजगारांची निर्मिती.</li>
            <li>अग्रगण्य अभियांत्रिकी संस्थांशी थेट संशोधन भागीदारी.</li>
          </ul>
        `
      }
    }
  },
  {
    id: 'news-2',
    categoryId: 'india',
    authorId: 'author-2',
    imageUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80',
    imageCaption: 'The verdant valleys and ancient biodiversity corridors of the Western Ghats / Sahyadri range in Maharashtra.',
    imageCredit: 'NEWSORA Environment Cell / Unsplash',
    sourceUrl: 'https://forests.maharashtra.gov.in',
    tags: ['Maharashtra', 'Sahyadri', 'Environment', 'WesternGhats', 'Conservation'],
    isFeatured: true,
    isBreaking: false,
    isTrending: true,
    readingTimeMinutes: 5,
    viewCount: 2940,
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    translations: {
      en: {
        title: 'Maharashtra Forest Department Launches Community-Led Ecological Sanctuary in Fragile Sahyadri Corridors',
        description: 'New participatory sanctuary network along Karjat and Malshej Ghats safeguards endangered flora and ensures natural water catchment preservation.',
        slug: 'maharashtra-community-ecological-sanctuary-sahyadri',
        status: 'published',
        seoTitle: 'Maharashtra Sahyadri Ecological Sanctuary Launched | NEWSORA',
        seoDescription: 'Maharashtra establishes participatory ecological conservation corridors across the Sahyadri mountains with local community guardianship.',
        publishedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
        content: `
          <p class="lead">In a landmark conservation model combining indigenous forestry wisdom with modern satellite telemetry, the Maharashtra State Forest Department has notified 4,200 hectares of contiguous Western Ghats forest as a community-protected ecological corridor.</p>
          
          <h2>Protecting Critical Catchments for Millions</h2>
          <p>The Sahyadri range functions as the primary water tower of western Maharashtra, feeding rivers such as the Godavari, Krishna, and Ulhas. The new policy formally halts unsanctioned hill-slope quarrying and implements reforestation of endemic evergreen tree species.</p>
          
          <blockquote>"True forest protection succeeds only when local agrarian and tribal communities are recognized as the primary custodians of the land." — Principal Chief Conservator of Forests</blockquote>
          
          <h2>Key Highlights:</h2>
          <ul>
            <li>Formation of 32 village-level Eco-Development Committees (EDCs).</li>
            <li>Establishment of botanical seed banks for rare endemic medicinal herbs.</li>
            <li>Real-time satellite surveillance against illegal logging and forest fires.</li>
            <li>Sustainable eco-tourism revenue directly deposited to village gram funds.</li>
          </ul>
        `
      },
      hi: {
        title: 'महाराष्ट्र में सह्याद्री पर्वतमाला के संवेदनशील वनों के संरक्षण हेतु सामुदायिक पारिस्थितिकी गलियारा घोषित',
        description: 'कर्जत और मालशेज घाट क्षेत्रों में स्थानीय ग्रामीणों की भागीदारी से 4,200 हेक्टेयर वन क्षेत्र का वैज्ञानिक संरक्षण शुरू।',
        slug: 'maharashtra-community-ecological-sanctuary-sahyadri-hi',
        status: 'published',
        seoTitle: 'सह्याद्री वन संरक्षण - महाराष्ट्र की अनूठी पहल | NEWSORA',
        seoDescription: 'महाराष्ट्र वन विभाग ने पश्चिमी घाट के पर्यावरण को सहेजने के लिए जनभागीदारी से युक्त नई योजना प्रारंभ की।',
        publishedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
        content: `
          <p class="lead">महाराष्ट्र के पश्चिमी घाट (सह्याद्री) की जैव विविधता को बचाने के लिए वन विभाग ने ग्रामीणों के सहयोग से 4,200 हेक्टेयर वन क्षेत्र को विशेष पारिस्थितिकी गलियारा घोषित किया है।</p>
          
          <h2>लाखों नागरिकों की जल सुरक्षा</h2>
          <p>सह्याद्री की पर्वत श्रृंखलाएं महाराष्ट्र की प्रमुख नदियों का उद्गम स्थल हैं। इस कदम से अवैध खनन और वनों की कटाई पर पूर्ण प्रतिबंध लगेगा।</p>
        `
      },
      mr: {
        title: 'सह्याद्रीच्या संवर्धनासाठी महाराष्ट्राचा ऐतिहासिक निर्णय; ४,२०० हेक्टर वनक्षेत्र लोकसहभागातून संरक्षित',
        description: 'कर्जत आणि माळशेज परिसरातील संवेदनशील डोंगररांगांसाठी विशेष संवर्धन कॉरिडॉर; दुर्मिळ वनस्पती व पाणलोट क्षेत्राचे संरक्षण.',
        slug: 'maharashtra-community-ecological-sanctuary-sahyadri-mr',
        status: 'published',
        seoTitle: 'सह्याद्री संवर्धन लोकसहभाग कॉरिडॉर - महाराष्ट्र शासन | NEWSORA',
        seoDescription: 'पश्चिम घाटाच्या रक्षणासाठी स्थानिक ग्रामस्थांच्या साथीने नवा पर्यावरण आराखडा कार्यान्वित.',
        publishedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
        content: `
          <p class="lead">महाराष्ट्र शासनाच्या वन विभागाने सह्याद्रीच्या डोंगररांगांमधील ४,२०० हेक्टर संवेदनशील वनक्षेत्राला लोकसहभागातून संरक्षित परिसंस्था कॉरिडॉर म्हणून घोषित केले आहे.</p>
          
          <h2>महाराष्ट्राच्या जीवनवाहिन्यांचे रक्षण</h2>
          <p>गोदावरी, कृष्णा आणि उल्हास या नद्यांचे उगमस्थान असलेल्या सह्याद्रीचे रक्षण करणे ही राज्याच्या शाश्वत विकासासाठी तातडीची गरज होती.</p>
        `
      }
    }
  },
  {
    id: 'news-3',
    categoryId: 'india',
    authorId: 'author-1',
    imageUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80',
    imageCaption: 'High-speed Vande Bharat express train traversing modern electrified rail corridors across western India.',
    imageCredit: 'NEWSORA National Bureau / Unsplash',
    sourceUrl: 'https://indianrailways.gov.in',
    tags: ['India', 'Railways', 'Infrastructure', 'VandeBharat', 'Economy'],
    isFeatured: true,
    isBreaking: false,
    isTrending: false,
    readingTimeMinutes: 3,
    viewCount: 2150,
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    translations: {
      en: {
        title: 'Indian Railways Rolls Out Sleeper Vande Bharat Trains for Overnight Long-Distance Intercity Travel',
        description: 'With modern aerodynamic design, soundproof sleeper cabins, and speeds up to 160 km/h, the new rakes promise to redefine overnight travel in India.',
        slug: 'indian-railways-sleeper-vande-bharat-rollout',
        status: 'published',
        seoTitle: 'Indian Railways Sleeper Vande Bharat Trains Rollout | NEWSORA',
        seoDescription: 'Indian Railways officially commences commercial trial runs for the indigenous Sleeper Vande Bharat trainsets.',
        publishedAt: new Date(Date.now() - 3600000 * 6).toISOString(),
        content: `
          <p class="lead">Indian Railways has commenced the commercial readiness trials of its highly anticipated Sleeper Vande Bharat trainsets, engineered entirely in India to deliver world-class overnight transit.</p>
          <p>Featuring regenerative braking, ergonomic berth design, automated sensor-driven vestibules, and advanced collision avoidance systems, the trains will significantly reduce transit time on heavy-density routes like Delhi-Mumbai and Bengaluru-Chennai.</p>
        `
      },
      hi: {
        title: 'भारतीय रेल ने लंबी दूरी के लिए स्लीपर वंदे भारत ट्रेनों का किया शुभारंभ',
        description: 'विश्वस्तरीय सुविधाओं, आधुनिक सुरक्षा प्रणालियों और 160 किमी/घंटा की गति से सुसज्जित स्लीपर वंदे भारत का परीक्षण सफल।',
        slug: 'indian-railways-sleeper-vande-bharat-rollout-hi',
        status: 'published',
        seoTitle: 'स्लीपर वंदे भारत ट्रेन - भारतीय रेल का नया युग | NEWSORA',
        seoDescription: 'भारतीय रेल ने लंबी दूरी के यात्रियों के लिए स्वदेशी स्लीपर वंदे भारत ट्रेनों की शुरुआत की।',
        publishedAt: new Date(Date.now() - 3600000 * 6).toISOString(),
        content: `
          <p class="lead">भारतीय रेलवे ने लंबी दूरी के सफर को आरामदायक बनाने के उद्देश्य से अपनी पहली स्लीपर वंदे भारत ट्रेन का व्यावसायिक परीक्षण शुरू कर दिया है।</p>
        `
      },
      mr: {
        title: 'भारतीय रेल्वेची स्लीपर ‘वंदे भारत’ रुळांवर; रात्रीच्या प्रवासासाठी अत्याधुनिक सुविधा',
        description: '१६० किमी प्रतितास वेग, ध्वनिरोधक केबिन आणि स्वदेशी तंत्रज्ञानाने सज्ज असलेली स्लीपर वंदे भारत लवकरच नियमित प्रवाशांच्या सेवेत.',
        slug: 'indian-railways-sleeper-vande-bharat-rollout-mr',
        status: 'published',
        seoTitle: 'स्लीपर वंदे भारत रेल्वे - प्रवाशांसाठी नवे दालन | NEWSORA',
        seoDescription: 'लांब पल्ल्याच्या प्रवासासाठी भारतीय रेल्वेची स्लीपर वंदे भारत सज्ज.',
        publishedAt: new Date(Date.now() - 3600000 * 6).toISOString(),
        content: `
          <p class="lead">लांब पल्ल्याच्या रात्रीच्या प्रवासाला अधिक आरामदायी आणि वेगवान बनवण्यासाठी भारतीय रेल्वेने स्लीपर वंदे भारत ट्रेनची चाचणी यशस्वीरीत्या पूर्ण केली आहे.</p>
        `
      }
    }
  },
  {
    id: 'news-4',
    categoryId: 'business',
    authorId: 'author-3',
    imageUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&q=80',
    imageCaption: 'Stock market ticker screens displaying green upward trends on Dalal Street in Mumbai.',
    imageCredit: 'NEWSORA Financial Desk / Unsplash',
    sourceUrl: 'https://bseindia.com',
    tags: ['Business', 'Economy', 'Markets', 'Sensex', 'Investment'],
    isFeatured: false,
    isBreaking: false,
    isTrending: true,
    readingTimeMinutes: 3,
    viewCount: 1840,
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    translations: {
      en: {
        title: 'Sensex Scales Fresh Historic Peak on Strong Domestic Capital Inflows and Resilient Manufacturing Output',
        description: 'Benchmark indices register robust gains led by banking, capital goods, and renewable energy sectors as retail investor participation hits record heights.',
        slug: 'sensex-scales-fresh-historic-peak-manufacturing-growth',
        status: 'published',
        seoTitle: 'Sensex Hits Historic All-Time High | NEWSORA Business',
        seoDescription: 'BSE Sensex and Nifty hit fresh record milestones as foreign and domestic institutional investors reaffirm optimism in the Indian economy.',
        publishedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
        content: `
          <p class="lead">Indian equities surged to unprecedented record levels today as upbeat corporate earnings and sustained capital expenditure propelled benchmark indices to historic highs.</p>
          <p>Analysts highlighted that retail investor discipline through mutual fund SIPs has provided an unprecedented cushion against global volatile headwinds.</p>
        `
      },
      hi: {
        title: 'घरेलू निवेश और औद्योगिक वृद्धि के दम पर सेंसेक्स ने बनाया नया ऐतिहासिक रिकॉर्ड',
        description: 'बैंकिंग, विनिर्माण और ऊर्जा शेयरों में जोरदार खरीदारी से शेयर बाजार में जबरदस्त उछाल देखा गया।',
        slug: 'sensex-scales-fresh-historic-peak-manufacturing-growth-hi',
        status: 'published',
        seoTitle: 'सेंसेक्स ने छुआ नया ऐतिहासिक शिखर | NEWSORA',
        seoDescription: 'भारतीय शेयर बाजार में रिकॉर्ड तेजी, निवेशकों में जबरदस्त उत्साह।',
        publishedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
        content: `
          <p class="lead">भारतीय शेयर बाजार ने आज फिर एक नया कीर्तिमान स्थापित किया। घरेलू निवेशकों के भरोसे और मजबूत आर्थिक आंकड़ों से सेंसेक्स और निफ्टी नए शिखर पर पहुंचे।</p>
        `
      },
      mr: {
        title: 'शेअर बाजारात विक्रमी तेजी; सेन्सेक्सने गाठली ऐतिहासिक नवी उच्चांकी पातळी',
        description: 'बँकिंग आणि पायाभूत सुविधा क्षेत्रातील शेअर्समध्ये मोठ्या प्रमाणावर खरेदी; देशांतर्गत गुंतवणूकदारांचा विश्वास वाढला.',
        slug: 'sensex-scales-fresh-historic-peak-manufacturing-growth-mr',
        status: 'published',
        seoTitle: 'सेन्सेक्सचा ऐतिहासिक विक्रम | NEWSORA अर्थकारण',
        seoDescription: 'मुंबई शेअर बाजारात उत्साहाचे वातावरण, सेन्सेक्सने नवा उच्चांक प्रस्थापित केला.',
        publishedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
        content: `
          <p class="lead">देशांतर्गत आर्थिक मजबुती आणि उत्तम उद्योग कामगिरीच्या जोरावर मुंबई शेअर बाजाराने आज नवा ऐतिहासिक उच्चांक नोंदवला.</p>
        `
      }
    }
  },
  {
    id: 'news-5',
    categoryId: 'sports',
    authorId: 'author-1',
    imageUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80',
    imageCaption: 'A packed cricket stadium in India celebrating a memorable boundary under stadium floodlights.',
    imageCredit: 'NEWSORA Sports Bureau / Unsplash',
    sourceUrl: 'https://bcci.tv',
    tags: ['Cricket', 'Sports', 'TeamIndia', 'WorldCup', 'Victory'],
    isFeatured: false,
    isBreaking: false,
    isTrending: true,
    readingTimeMinutes: 3,
    viewCount: 3100,
    createdAt: new Date(Date.now() - 3600000 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 10).toISOString(),
    translations: {
      en: {
        title: 'Team India Clinches Thrilling Decider in Final Over Showdown with Superb Bowling Spell',
        description: 'Pace spearhead delivers masterclass in death bowling to defend a modest total and secure the bilateral trophy before an ecstatic home crowd.',
        slug: 'team-india-clinches-thrilling-decider-final-over',
        status: 'published',
        seoTitle: 'Team India Historic Victory in Final Over Thriller | NEWSORA',
        seoDescription: 'Sensational death bowling seals an unforgettable victory for India in the series decider match.',
        publishedAt: new Date(Date.now() - 3600000 * 10).toISOString(),
        content: `
          <p class="lead">In an electrifying contest that came down to the final three deliveries, India held their nerve to secure a pulsating victory in the decisive bilateral clash.</p>
        `
      },
      hi: {
        title: 'रोमांचक मुकाबले में भारतीय टीम की शानदार जीत, आखिरी ओवर में गेंदबाजों ने पलटी बाजी',
        description: 'अंतिम क्षणों में कसी हुई गेंदबाजी के दम पर भारत ने निर्णायक मुकाबले में दर्ज की यादगार जीत।',
        slug: 'team-india-clinches-thrilling-decider-final-over-hi',
        status: 'published',
        seoTitle: 'भारतीय टीम की रोमांचक जीत | NEWSORA खेल',
        seoDescription: 'भारत ने अंतिम ओवर में रोमांचक अंदाज में दर्ज की श्रृंखला में ऐतिहासिक जीत।',
        publishedAt: new Date(Date.now() - 3600000 * 10).toISOString(),
        content: `
          <p class="lead">अंतिम गेंद तक खिंचे बेहद कड़े मुकाबले में भारतीय गेंदबाजों ने धैर्य बनाए रखते हुए टीम को शानदार जीत दिलाई।</p>
        `
      },
      mr: {
        title: 'शेवटच्या षटकातील थरारात भारतीय संघाचा दिमाखदार विजय; मालिका विजयावर शिक्कामोर्तब',
        description: 'उत्कृष्ट गोलंदाजीच्या जोरावर भारताने निर्णायक सामन्यात मिळवला चित्तथरारक विजय.',
        slug: 'team-india-clinches-thrilling-decider-final-over-mr',
        status: 'published',
        seoTitle: 'भारतीय संघाचा थरारक विजय | NEWSORA क्रीडा',
        seoDescription: 'शेवटच्या षटकात उत्कृष्ट कामगिरी करत भारताने निर्णायक सामना खिशात घातला.',
        publishedAt: new Date(Date.now() - 3600000 * 10).toISOString(),
        content: `
          <p class="lead">शेवटच्या चेंडूपर्यंत रंगलेल्या अत्यंत चुरशीच्या सामन्यात भारतीय खेळाडूंनी अप्रतिम खेळ दाखवून मालिका जिंकली.</p>
        `
      }
    }
  },
  {
    id: 'news-6',
    categoryId: 'entertainment',
    authorId: 'author-2',
    imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80',
    imageCaption: 'Auditorium celebrations honoring exceptional cinematic storytelling across regional and national languages.',
    imageCredit: 'NEWSORA Entertainment Bureau / Unsplash',
    sourceUrl: 'https://mib.gov.in',
    tags: ['Entertainment', 'Cinema', 'Awards', 'FilmFestival', 'Bollywood'],
    isFeatured: false,
    isBreaking: false,
    isTrending: true,
    readingTimeMinutes: 3,
    viewCount: 2450,
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    translations: {
      en: {
        title: 'National Cinema Awards Celebrates Masterpieces in Indian Storytelling Across Regional Languages',
        description: 'Jury honors groundbreaking visual craftsmanship, poignant independent narratives, and veteran artists at grand annual ceremony.',
        slug: 'national-cinema-awards-celebrates-indian-storytelling',
        status: 'published',
        seoTitle: 'National Cinema Awards - Honoring Best in Indian Cinema | NEWSORA',
        seoDescription: 'Annual National Cinema Awards celebrate iconic filmmakers, regional classics, and contemporary actors across India.',
        publishedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
        content: `
          <p class="lead">The vibrant spectrum of Indian cinema took center stage as the prestigious National Cinema Awards celebrated creative excellence, diverse regional storytelling, and cinematic mastery.</p>
          <p>Highlighting the convergence of artistic depth and popular appeal, juries awarded top honors to independent filmmakers alongside big-budget cinematic epics.</p>
        `
      },
      hi: {
        title: 'राष्ट्रीय सिनेमा पुरस्कारों में भारतीय फिल्मों की धूम, क्षेत्रीय और क्लासिक सिनेमा को मिला सर्वोच्च सम्मान',
        description: 'भव्य समारोह में उत्कृष्ट पटकथा, निर्देशन और अभिनय के लिए दिग्गज कलाकारों को सम्मानित किया गया।',
        slug: 'national-cinema-awards-celebrates-indian-storytelling-hi',
        status: 'published',
        seoTitle: 'राष्ट्रीय सिनेमा पुरस्कार - भारतीय सिनेमा का उत्सव | NEWSORA मनोरंजन',
        seoDescription: 'सिनेमा जगत के प्रतिष्ठित राष्ट्रीय पुरस्कारों में भारतीय कलाकारों का सम्मान।',
        publishedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
        content: `
          <p class="lead">भारतीय सिनेमा की समृद्ध विविधता और उत्कृष्ट कला को सम्मानित करते हुए राष्ट्रीय सिनेमा पुरस्कारों का भव्य आयोजन संपन्न हुआ।</p>
        `
      },
      mr: {
        title: 'राष्ट्रीय चित्रपट पुरस्कारांमध्ये भारतीय सिनेमाचा गौरव; प्रादेशिक चित्रपटांचा झेंडा फडकला',
        description: 'उत्कृष्ट अभिनय, दिग्दर्शन आणि संगीतासाठी मानाचे राष्ट्रीय पुरस्कार प्रदान; चित्रपटसृष्टीतील कलाकारांचा सन्मान.',
        slug: 'national-cinema-awards-celebrates-indian-storytelling-mr',
        status: 'published',
        seoTitle: 'राष्ट्रीय चित्रपट पुरस्कार - भारतीय सिनेमाचा गौरव | NEWSORA मनोरंजन',
        seoDescription: 'राष्ट्रीय चित्रपट पुरस्कार सोहळ्यात उत्कृष्ट चित्रपटांचा आणि कलाकारांचा सन्मान.',
        publishedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
        content: `
          <p class="lead">भारतीय चित्रपटसृष्टीतील वैविध्य आणि सर्जनशीलतेला सलाम करत राष्ट्रीय चित्रपट पुरस्कार सोहळा उत्साहात पार पडला.</p>
        `
      }
    }
  }
];
