export type Language = "devanagari" | "roman";

export interface TranslationDictionary {
    // Navbar
    nav_explore: string;
    nav_poets: string;
    nav_submit: string;
    nav_admin: string;
    nav_signin: string;
    nav_signout: string;
    nav_search_placeholder: string;
    nav_profile: string;
    nav_my_submissions: string;
    nav_my_likes: string;

    // Home
    home_hero_tag: string;
    home_hero_title_prefix: string;
    home_hero_title_suffix: string;
    home_hero_desc: string;
    home_hero_btn_start: string;
    home_hero_btn_contribute: string;
    home_stat_poems: string;
    home_stat_poets: string;
    home_stat_words: string;
    home_interactive_tag: string;
    home_interactive_title: string;
    home_interactive_desc: string;
    home_interactive_hint: string;
    home_featured_title: string;
    home_featured_subtitle: string;
    home_view_all: string;
    home_poets_title: string;
    home_poets_subtitle: string;
    home_popular_tag: string;
    home_popular_title: string;
    home_popular_subtitle: string;
    home_read_poem: string;
    home_disclaimer: string;

    // Footer
    footer_brand_desc: string;
    footer_nav_title: string;
    footer_foundation_title: string;
    footer_rights: string;
    footer_made_with: string;
    footer_links_explore: string;
    footer_links_poets: string;
    footer_links_collections: string;
    footer_links_submit: string;
    footer_links_about: string;
    footer_links_contact: string;
    footer_links_privacy: string;
    footer_links_terms: string;

    // Admin
    admin_title: string;
    admin_subtitle: string;
    admin_tab_review: string;
    admin_tab_words: string;
    admin_queue_empty: string;
    admin_btn_approve: string;
    admin_btn_enrich: string;
    admin_word_hint: string;

    // Explore
    explore_title: string;
    explore_subtitle: string;
    explore_search_placeholder: string;
    explore_results_found: string;
    explore_filter_btn: string;
    explore_no_results_title: string;
    explore_no_results_desc: string;

    // Categories
    cat_all: string;
    cat_romantic: string;
    cat_nature: string;
    cat_patriotic: string;
    cat_spiritual: string;
    cat_social: string;
    cat_inspirational: string;
    cat_folklore: string;
    cat_classical: string;
    cat_modern: string;

    // Poets Page
    poets_title: string;
    poets_subtitle: string;
    poets_loading: string;
    poets_no_results: string;
    poets_no_results_letter: string; // contains a {letter} placeholder
    poets_prev: string;
    poets_next: string;
    poets_page_of: string;
    poets_showing: string;
    poets_all_letters: string;
    poets_results: string;

    // Submit Page
    submit_title: string;
    submit_subtitle: string;
    submit_step_1: string;
    submit_step_2: string;
    submit_step_3: string;
    submit_label_poet_name: string;
    submit_ph_poet_name: string;
    submit_label_poem_title: string;
    submit_ph_poem_title: string;
    submit_label_genre: string;
    submit_ph_genre: string;
    submit_label_body: string;
    submit_btn_scan: string;
    submit_ph_body: string;
    submit_review_title: string;
    submit_review_desc: string;
    submit_review_preview: string;
    submit_btn_prev: string;
    submit_btn_next: string;
    submit_btn_submit: string;
    submit_success_title: string;
    submit_success_desc: string;
    submit_success_view_btn: string;
    submit_success_another_btn: string;
    poem_back: string;
    poem_focus_mode: string;
    poem_exit_focus: string;
    poem_by: string;
    poem_about_title: string;
    poem_genre: string;
    poem_metre: string;
    poem_free_verse: string;
    poem_explore_more: string;
    poem_view_poet_profile: string;
    poem_traditional: string;
    poet_grand_master: string;
    poet_works: string;
    poet_authored_works: string;
    poet_no_poems: string;
    poet_not_found: string;
    poet_not_found_desc: string;

    // About Us Page
    about_title: string;
    about_subtitle: string;
    about_hero_desc_1: string;
    about_hero_desc_2: string;
    about_hero_desc_3: string;
    about_btn_explore: string;
    about_btn_poets: string;
    about_vision_preserve_title: string;
    about_vision_preserve_desc: string;
    about_vision_understand_title: string;
    about_vision_understand_desc: string;
    about_vision_connect_title: string;
    about_vision_connect_desc: string;
    about_unique_tag: string;
    about_unique_title: string;
    about_feat_1_title: string;
    about_feat_1_desc: string;
    about_feat_2_title: string;
    about_feat_2_desc: string;
    about_feat_3_title: string;
    about_feat_3_desc: string;
    about_feat_4_title: string;
    about_feat_4_desc: string;
    about_feat_5_title: string;
    about_feat_5_desc: string;
    about_feat_6_title: string;
    about_feat_6_desc: string;
    about_vocab_tag: string;
    about_vocab_title: string;
    about_vocab_desc: string;
}

export const translations: Record<Language, TranslationDictionary> = {
    roman: {
        nav_explore: "Explore",
        nav_poets: "Poets",
        nav_submit: "Submit",
        nav_admin: "Admin",
        nav_signin: "Sign In",
        nav_signout: "Sign Out",
        nav_search_placeholder: "Search...",
        nav_profile: "Profile",
        nav_my_submissions: "My Submissions",
        nav_my_likes: "Liked Poems",

        home_hero_tag: "Godwa Space — Premium Poetry Experience",
        home_hero_title_prefix: "Experience the Soul of",
        home_hero_title_suffix: "Marathi Poetry on Godwa Space",
        home_hero_desc: "Discover timeless verses, explore linguistic depths with our interactive reader, and join Godwa Space—a community dedicated to the sweet essence of Marathi literature.",
        home_hero_btn_start: "Start Exploring",
        home_hero_btn_contribute: "Contribute Poetry",
        home_stat_poems: "Poems Archive",
        home_stat_poets: "Master Poets",
        home_stat_words: "Defined Words",
        home_interactive_tag: "Interactive Experience",
        home_interactive_title: "Every Word Tells a Story",
        home_interactive_desc: "Click on any highlighted word in the demo below to discover its meaning, pronunciation, and linguistic details. Poetry becomes a journey of discovery.",
        home_interactive_hint: "Try clicking on the highlighted words above",
        home_featured_title: "Timeless Verses",
        home_featured_subtitle: "Handpicked masterpieces from our collection",
        home_view_all: "View All",
        home_poets_title: "Celebrated Poets",
        home_poets_subtitle: "The architects of Marathi literature",
        home_popular_tag: "Popular Verses",
        home_popular_title: "Verses Worth Savouring",
        home_popular_subtitle: "A rotating selection of poems from Godwa Space",
        home_read_poem: "Read Poem",
        home_disclaimer: "Godwa Space is a non-commercial platform solely dedicated to spreading the sweetness of the Marathi language. Copyright of all content on this website belongs to the respective owners; credits are given to poets wherever possible. In case you want to remove your poem, please email us and we will remove it.",

        footer_brand_desc: "Godwa Space is a digital sanctuary for Marathi literature. Our mission is to preserve the rich heritage of Marathi poetry and make its profound linguistic beauty accessible through technology.",
        footer_nav_title: "Navigation",
        footer_foundation_title: "Foundation",
        footer_rights: "Godwa Space — Marathi Poetry Platform. All rights reserved.",
        footer_made_with: "Made with",
        footer_links_explore: "Explore",
        footer_links_poets: "Poets",
        footer_links_collections: "Collections",
        footer_links_submit: "Submit",
        footer_links_about: "Amchya Baddal (About Us)",
        footer_links_contact: "Contact",
        footer_links_privacy: "Privacy Policy",
        footer_links_terms: "Terms of Service",

        admin_title: "Admin Center",
        admin_subtitle: "Manage submissions and linguistic enrichment",
        admin_tab_review: "Review Queue",
        admin_tab_words: "Word Enrichment",
        admin_queue_empty: "Review Queue Empty",
        admin_btn_approve: "Approve",
        admin_btn_enrich: "Enrich with AI",
        admin_word_hint: "Lacks definition and linguistic metadata. Click the wand to auto-populate using LLM service.",

        explore_title: "Explore Poetry",
        explore_subtitle: "Discover the vast landscape of Marathi verse on Godwa Space",
        explore_search_placeholder: "Search by title or poet...",
        explore_results_found: "Results Found",
        explore_filter_btn: "Filter",
        explore_no_results_title: "No poems found",
        explore_no_results_desc: "Try adjusting your filters or search query",

        cat_all: "All",
        cat_romantic: "Romantic",
        cat_nature: "Nature",
        cat_patriotic: "Patriotic",
        cat_spiritual: "Spiritual",
        cat_social: "Social",
        cat_inspirational: "Inspirational",
        cat_folklore: "Folklore",
        cat_classical: "Classical",
        cat_modern: "Modern",

        poets_title: "Celebrated Poets",
        poets_subtitle: "Explore the lives and legacies of the master weavers of Marathi verse.",
        poets_loading: "Loading Literary Legends...",
        poets_no_results: "No poets found in our archives yet.",
        poets_no_results_letter: "No poets under “{letter}” yet.",
        poets_prev: "Prev",
        poets_next: "Next",
        poets_page_of: "of",
        poets_showing: "Showing",
        poets_all_letters: "All",
        poets_results: "poets",

        submit_title: "Contribute Poetry",
        submit_subtitle: "Share the beauty of Marathi verses with Godwa Space.",
        submit_step_1: "Details",
        submit_step_2: "Content",
        submit_step_3: "Review",
        submit_label_poet_name: "Poet Name",
        submit_ph_poet_name: "Type poet name...",
        submit_label_poem_title: "Poem Title",
        submit_ph_poem_title: "Enter poem title...",
        submit_label_genre: "Genre / Tag",
        submit_ph_genre: "Select Genre",
        submit_label_body: "Poem Body (Marathi)",
        submit_btn_scan: "Scan Manuscript",
        submit_ph_body: "Paste or type poem in Devanagari...",
        submit_review_title: "Ready to Review",
        submit_review_desc: "Your poem will be submitted for community review and AI word enrichment before being published on Godwa Space.",
        submit_review_preview: "Submission Preview",
        submit_btn_prev: "Previous",
        submit_btn_next: "Next Step",
        submit_btn_submit: "Submit for Review",
        submit_success_title: "Poem Submitted!",
        submit_success_desc: "Thank you for your contribution. Your poem is now pending community review and will appear in your submissions.",
        submit_success_view_btn: "View My Submissions",
        submit_success_another_btn: "Submit Another",
        poem_back: "Back",
        poem_focus_mode: "Focus Mode",
        poem_exit_focus: "Exit Focus",
        poem_by: "by",
        poem_about_title: "About this Poem",
        poem_genre: "Genre",
        poem_metre: "Metre",
        poem_free_verse: "Free Verse",
        poem_explore_more: "Explore More",
        poem_view_poet_profile: "View Poet Profile",
        poem_traditional: "Traditional",
        poet_grand_master: "Grand Master",
        poet_works: "Works",
        poet_authored_works: "Authored Works",
        poet_no_poems: "No poems by this poet found in our archives yet.",
        poet_not_found: "Poet Not Found",
        poet_not_found_desc: "The person you are looking for has not yet reached our archives.",

        about_title: "Amchya Baddal — Godwa Space",
        about_subtitle: "Godwa Space — Marathi Kavitenche Digital Maherghar",
        about_hero_desc_1: "Godwa Space is a digital sanctuary for Marathi poetry.",
        about_hero_desc_2: "Amche dhyeya mhanje Marathi kavitensha samruddha warasa japane, shabdanshabda arthasaha ti pratyekaparyanta pohochawane—mag tumhi june dardi wachak asal, navin bhasha shikanaare asal kinwa Marathi sahityachi aavad aslele rasik asal.",
        about_hero_desc_3: "Kathin shabdasangraha, boli bhasha kinwa lipichya adsaramule sundar kavita wachanyapasun wanchit rahu naye, yawar amcha vishwas aahe.",
        about_btn_explore: "Kavita Explore Kara",
        about_btn_poets: "Kavintchi Suchi",
        about_vision_preserve_title: "Jatan (Preserve)",
        about_vision_preserve_desc: "Abhijat aani aadhunik Marathi kavita, boli bhashatil shabda aani durmiya sahityik kalakruti surakshit japane.",
        about_vision_understand_title: "Aakalan (Understand)",
        about_vision_understand_desc: "Kavita wachatana pratyek shabdacha artha, sandarbhasahita spashtikaran aani boli bhashatil bhavartha uplabdh karun dene.",
        about_vision_connect_title: "Jodane (Connect)",
        about_vision_connect_desc: "Jagachya kontyahi konyatil wachankana Devanagari kinwa Roman Marathi lipimadhe sahajatene kavita wachanyachi suviddha dene.",
        about_unique_tag: "Vaisishtye",
        about_unique_title: "Godwa Space Che Veglepan Kay?",
        about_feat_1_title: "Devanagari va Roman Lipit Vachan",
        about_feat_1_desc: "Pratyek kavita Devanagari Marathi aani Roman Marathi lipyantaranat uplabdh aahe. Eka clickwar sahaj lipi badla.",
        about_feat_2_title: "Shabdanshabda Artha (Rekhta Style)",
        about_feat_2_desc: "Kontyahi shabdawar tap kara aani tyacha achuk artha lagech paha. Shabdakoshachi garaj nahi.",
        about_feat_3_title: "Sandarbhasahita Arthanirvachan",
        about_feat_3_desc: "Keval shabdakoshatil kordi vyakhya na deta kavitat kavila kay abhipreta aahe, te spashta kele jaate.",
        about_feat_4_title: "Boli Bhasha va Durmiya Shabdasangraha",
        about_feat_4_desc: "Abhijat Marathi, Sanskrit-prachur shabda aani vividh boli bhashanche shabdakosh samavishta.",
        about_feat_5_title: "Kavi Parichay va Charitra",
        about_feat_5_desc: "Kavinche jeevanprawas, tyancha kaal aani tyanchi sahitya sampada yanchi savistar mahiti.",
        about_feat_6_title: "Chhanda aani Vruttachi Mahiti",
        about_feat_6_desc: "Kavitache vrutta aani sangeetmay rachana samjun ghya. Shaili va rasanusar kavita shodha.",
        about_vocab_tag: "Sahityik Shabdakosh",
        about_vocab_title: "Godwa Space Madhil Khas Shabda",
        about_vocab_desc: "Marathi sahityat bhavnik aani sanskrutik kholi aslele kahi atyanta dekhne shabda:",
    },
    devanagari: {
        nav_explore: "एक्सप्लोर",
        nav_poets: "कवी",
        nav_submit: "साहित्य पाठवा",
        nav_admin: "प्रशासन",
        nav_signin: "लॉग इन",
        nav_signout: "बाहेर पडा",
        nav_search_placeholder: "शोधा...",
        nav_profile: "प्रोफाइल",
        nav_my_submissions: "माझी सादरीकरणे",
        nav_my_likes: "आवडलेल्या कविता",

        home_hero_tag: "Godwa Space — प्रीमियम काव्य अनुभव",
        home_hero_title_prefix: "अनुभवा",
        home_hero_title_suffix: "मराठी कवितेचा आत्मा — Godwa Space",
        home_hero_desc: "अजरामर कविता शोधा, आमच्या इंटरॅक्टिव्ह रीडरसह भाषिक खोली एक्सप्लोर करा आणि Godwa Space मधील मराठी साहित्याच्या गोडव्याला वाहिलेल्या समुदायात सामील व्हा.",
        home_hero_btn_start: "एक्सप्लोर करा",
        home_hero_btn_contribute: "कविता योगदान द्या",
        home_stat_poems: "कविता संग्रह",
        home_stat_poets: "दिग्गज कवी",
        home_stat_words: "परिभाषित शब्द",
        home_interactive_tag: "इंटरॅक्टिव्ह अनुभव",
        home_interactive_title: "प्रत्येक शब्दाची एक गोष्ट",
        home_interactive_desc: "त्याचा अर्थ, उच्चार आणि भाषिक तपशील शोधण्यासाठी खालील डेमोमधील कोणत्याही हायलाईट केलेल्या शब्दावर क्लिक करा.",
        home_interactive_hint: "वर हायलाईट केलेल्या शब्दांवर क्लिक करून पहा",
        home_featured_title: "अविट गोडी",
        home_featured_subtitle: "आमच्या संग्रहातील निवडक आणि उत्कृष्ट कविता",
        home_view_all: "सर्व पहा",
        home_poets_title: "प्रख्यात कवी",
        home_poets_subtitle: "मराठी साहित्याचे शिल्पकार",
        home_popular_tag: "लोकप्रिय कविता",
        home_popular_title: "मनाला भिडणाऱ्या ओळी",
        home_popular_subtitle: "Godwa Space मधील निवडक कवितांची झलक",
        home_read_poem: "कविता वाचा",
        home_disclaimer: "Godwa Space हे एक अव्यावसायिक व्यासपीठ आहे, जे केवळ मराठी भाषेचा गोडवा पसरवण्यासाठी समर्पित आहे. या संकेतस्थळावरील सर्व मजकुराचे हक्क संबंधित मालकांचे आहेत; शक्य असेल तिथे कवींना श्रेय दिले जाते. जर तुम्हाला तुमची कविता काढून टाकायची असेल, तर कृपया आम्हाला ईमेल करा आणि आम्ही ती काढून टाकू.",

        footer_brand_desc: "Godwa Space हे मराठी साहित्याचे डिजिटल माहेरघर आहे. मराठी कवितेचा समृद्ध वारसा जपणे आणि तंत्रज्ञाच्या माध्यमातून तिचे सौंदर्य सर्वांपर्यंत पोहोचवणे हे आमचे ध्येय आहे.",
        footer_nav_title: "नेव्हिगेशन",
        footer_foundation_title: "फाउंडेशन",
        footer_rights: "Godwa Space — मराठी कविता प्लॅटफॉर्म. सर्व हक्क राखीव.",
        footer_made_with: "मराठी साहित्यासाठी प्रेमाने बनवले",
        footer_links_explore: "एक्सप्लोर",
        footer_links_poets: "कवी",
        footer_links_collections: "संग्रह",
        footer_links_submit: "साहित्य पाठवा",
        footer_links_about: "आमच्या बद्दल",
        footer_links_contact: "संपर्क",
        footer_links_privacy: "गोपनीयता धोरण",
        footer_links_terms: "सेवा अटी",

        admin_title: "प्रशासन केंद्र",
        admin_subtitle: "सबमिशन आणि भाषिक समृद्धी व्यवस्थापित करा",
        admin_tab_review: "पुनरावलोकन रांग",
        admin_tab_words: "शब्द समृद्धी",
        admin_queue_empty: "पुनरावलोकन रांग रिकामी आहे",
        admin_btn_approve: "मंजूर करा",
        admin_btn_enrich: "AI सह समृद्ध करा",
        admin_word_hint: "व्याख्या आणि भाषिक मेटाडेटा नाही. LLM वापरून माहिती भरण्यासाठी कांडीवर क्लिक करा.",

        explore_title: "कविता शोधा",
        explore_subtitle: "Godwa Space वर मराठी कवितेचे विशाल विश्व धुंडाळा",
        explore_search_placeholder: "शीर्षक किंवा कवीद्वारे शोधा...",
        explore_results_found: "निकाल सापडले",
        explore_filter_btn: "फिल्टर",
        explore_no_results_title: "कोणत्याही कविता सापडल्या नाहीत",
        explore_no_results_desc: "तुमचे फिल्टर किंवा शोध संज्ञा बदलून पहा",

        cat_all: "सर्व",
        cat_romantic: "शृंगारिक",
        cat_nature: "निसर्ग",
        cat_patriotic: "देशभक्तीपर",
        cat_spiritual: "अध्यात्मिक",
        cat_social: "सामाजिक",
        cat_inspirational: "स्फूर्तिदायक",
        cat_folklore: "लोकसाहित्य",
        cat_classical: "अभिजात",
        cat_modern: "आधुनिक",

        poets_title: "प्रख्यात कवी",
        poets_subtitle: "मराठी कवितेच्या महान शिल्पकारांचे जीवन आणि वारसा जाणून घ्या.",
        poets_loading: "साहित्यिक दिग्गजांना लोड करत आहे...",
        poets_no_results: "आमच्या संग्रहात अद्याप कोणतेही कवी आढळले नाहीत.",
        poets_no_results_letter: "“{letter}” अक्षराखाली अद्याप कोणतेही कवी नाहीत.",
        poets_prev: "मागे",
        poets_next: "पुढे",
        poets_page_of: "पैकी",
        poets_showing: "दाखवत आहे",
        poets_all_letters: "सर्व",
        poets_results: "कवी",

        submit_title: "साहित्य पाठवा",
        submit_subtitle: "मराठी कवितांचे सौंदर्य Godwa Space सह जगासोबत शेअर करा.",
        submit_step_1: "तपशील",
        submit_step_2: "मजकूर",
        submit_step_3: "पुनरावलोकन",
        submit_label_poet_name: "कवीचे नाव",
        submit_ph_poet_name: "कवीचे नाव टाइप करा...",
        submit_label_poem_title: "कवितेचे शीर्षक",
        submit_ph_poem_title: "कवितेचे शीर्षक प्रविष्ट करा...",
        submit_label_genre: "शैली / टॅग",
        submit_ph_genre: "शैली निवडा",
        submit_label_body: "कवितेचा मजकूर (मराठी)",
        submit_btn_scan: "हस्तलिखित स्कॅन करा",
        submit_ph_body: "देवनागरीमध्ये कविता पेस्ट किंवा टाइप करा...",
        submit_review_title: "पुनरावलोकनासाठी तयार",
        submit_review_desc: "आपली कविता प्रकाशित होण्यापूर्वी समुदाय पुनरावलोकन आणि AI शब्द समृद्धीसाठी सादर केली जाईल.",
        submit_review_preview: "सबमिशन पूर्वावलोकन",
        submit_btn_prev: "मागे",
        submit_btn_next: "पुढील पायरी",
        submit_btn_submit: "पुनरावलोकनासाठी पाठवा",
        submit_success_title: "कविता सादर झाली!",
        submit_success_desc: "आपल्या योगदानाबद्दल धन्यवाद. आपली कविता आता समुदाय पुनरावलोकनासाठी प्रलंबित आहे आणि आपल्या सबमिशनमध्ये दिसेल.",
        submit_success_view_btn: "माझी सबमिशन पहा",
        submit_success_another_btn: "आणखी एक पाठवा",
        poem_back: "मागे",
        poem_focus_mode: "फोकस मोड",
        poem_exit_focus: "फोकस मोड बाहेर पडा",
        poem_by: "कवी",
        poem_about_title: "कवितेबद्दल",
        poem_genre: "प्रकार",
        poem_metre: "वृत्त / छंद",
        poem_free_verse: "मुक्त छंद",
        poem_explore_more: "अधिक शोधा",
        poem_view_poet_profile: "कवीचे प्रोफाइल पहा",
        poem_traditional: "पारंपारिक",
        poet_grand_master: "महान कवी",
        poet_works: "कविता",
        poet_authored_works: "लिखित कविता संग्रह",
        poet_no_poems: "या कवीची एकही कविता अद्याप आमच्या संग्रहात आढळली नाही.",
        poet_not_found: "कवी आढळले नाहीत",
        poet_not_found_desc: "आपण शोधत असलेले कवी अद्याप आमच्या संग्रहात समाविष्ट केलेले नाहीत.",

        about_title: "आमच्या बद्दल — Godwa Space",
        about_subtitle: "गोडवा स्पेस — मराठी कवितेचे डिजिटल माहेरघर",
        about_hero_desc_1: "Godwa Space (गोडवा स्पेस) हे मराठी साहित्याचे आणि कवितांचे समृद्ध डिजिटल माहेरघर आहे.",
        about_hero_desc_2: "मराठी कवितेचा अद्वितीय वारसा जपणे, तिची रचना समजून घेणे आणि शब्दन् शब्द अर्थासह ती प्रत्येकापर्यंत पोहोचवणे हे आमचे ध्येय आहे—मग तुम्ही जुने दर्दी वाचक असाल, नवीन भाषा शिकणारे असाल किंवा मराठी साहित्याची आवड असलेले रसिक असाल.",
        about_hero_desc_3: "कठिण शब्दसंग्रह, प्रादेशिक बोलीभाषा किंवा लिपीच्या अडसर मुळे सुंदर कविता वाचनापासून वंचित राहू नये, यावर आमचा विश्वास आहे.",
        about_btn_explore: "कविता एक्सप्लोर करा",
        about_btn_poets: "कवींची सूची",
        about_vision_preserve_title: "जतन (Preserve)",
        about_vision_preserve_desc: "अभिजात आणि आधुनिक मराठी कविता, बोलीभाषेतील शब्द आणि दुर्मिळ साहित्यिक कलाकृती सुरक्षित जपणे.",
        about_vision_understand_title: "आकलन (Understand)",
        about_vision_understand_desc: "कविता वाचताना प्रत्येक शब्दाचा अर्थ, संदर्भासहित स्पष्टीकरण आणि भावार्थ थेट कवितेच्या ओळींमध्ये उपलब्ध करून देणे.",
        about_vision_connect_title: "जोडणे (Connect)",
        about_vision_connect_desc: "जगाच्या कोणत्याही कोपऱ्यातील वाचकांना देवनागरी किंवा रोमन मराठी लिपीमध्ये सहजतेने कविता वाचण्याची सुविधा देणे.",
        about_unique_tag: "वैशिष्ट्ये",
        about_unique_title: "Godwa Space चे वेगळेपण काय?",
        about_feat_1_title: "देवनागरी व रोमन लिपीत वाचन",
        about_feat_1_desc: "प्रत्येक कविता देवनागरी मराठी आणि रोमन मराठी लिप्यंतरणात उपलब्ध आहे. एका क्लिकवर सहज लिपी बदला.",
        about_feat_2_title: "शब्दन् शब्द अर्थ (Rekhta Style)",
        about_feat_2_desc: "कोणत्याही शब्दावर टॅप करा आणि त्याचा अचूक अर्थ लगेच पहा. शब्दकोशाची गरज नाही.",
        about_feat_3_title: "संदर्भासहित अर्थनिर्वचन",
        about_feat_3_desc: "केवळ शब्दकोशातील कोरडी व्याख्या न देता कवितेत कवीला काय अभिप्रेत आहे, ते स्पष्ट केले जाते.",
        about_feat_4_title: "बोलीभाषा व दुर्मिळ शब्दसंग्रह",
        about_feat_4_desc: "अभिजात मराठी, संस्कृतप्रचुर शब्द आणि विविध बोलीभाषांचे शब्दकोश समाविष्ट.",
        about_feat_5_title: "कवी परिचय व चरित्र",
        about_feat_5_desc: "कवींचे जीवनप्रवास, त्यांचा काळ आणि त्यांची साहित्य संपदा यांची सविस्तर माहिती.",
        about_feat_6_title: "छंद आणि वृत्ताची माहिती",
        about_feat_6_desc: "कवितेचे वृत्त आणि संगीतमय रचना समजून घ्या. शैली व रसानुसार कविता शोधा.",
        about_vocab_tag: "साहित्यिक शब्दकोश",
        about_vocab_title: "Godwa Space मधील खास शब्द",
        about_vocab_desc: "मराठी साहित्यात भावनिक आणि सांस्कृतिक खोली असलेले काही अत्यंत देखणे शब्द:",
    }
};
