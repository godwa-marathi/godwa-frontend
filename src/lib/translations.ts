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

        home_hero_tag: "Premium Poetry Experience",
        home_hero_title_prefix: "Experience the Soul of",
        home_hero_title_suffix: "Marathi Poetry",
        home_hero_desc: "Discover timeless verses, explore linguistic depths with our interactive reader, and join a community dedicated to the sweet essence of Marathi literature.",
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

        footer_brand_desc: "Godwa is a digital sanctuary for Marathi literature. Our mission is to preserve the rich heritage of Marathi poetry and make its profound linguistic beauty accessible through technology.",
        footer_nav_title: "Navigation",
        footer_foundation_title: "Foundation",
        footer_rights: "Godwa Marathi Poetry Platform. All rights reserved.",
        footer_made_with: "Made with",
        footer_links_explore: "Explore",
        footer_links_poets: "Poets",
        footer_links_collections: "Collections",
        footer_links_submit: "Submit",
        footer_links_about: "About Us",
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
        explore_subtitle: "Discover the vast landscape of Marathi verse",
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

        submit_title: "Contribute Poetry",
        submit_subtitle: "Share the beauty of Marathi verses with the world.",
        submit_step_1: "Details", // implied step name if not explicit in UI, numbers used in code
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
        submit_review_desc: "Your poem will be submitted for community review and AI word enrichment before being published.",
        submit_review_preview: "Submission Preview",
        submit_btn_prev: "Previous",
        submit_btn_next: "Next Step",
        submit_btn_submit: "Submit for Review",
    },
    devanagari: {
        nav_explore: "एक्सप्लोर", // Transliterated "Explore" or proper Marathi "अन्वेषण", sticking to common UI terms
        nav_poets: "कवी",
        nav_submit: "साहित्य पाठवा",
        nav_admin: "प्रशासन",
        nav_signin: "लॉग इन",
        nav_signout: "बाहेर पडा",
        nav_search_placeholder: "शोधा...",

        home_hero_tag: "प्रीमियम काव्य अनुभव",
        home_hero_title_prefix: "अनुभवा",
        home_hero_title_suffix: "मराठी कवितेचा आत्मा",
        home_hero_desc: "अजरामर कविता शोधा, आमच्या इंटरॅक्टिव्ह रीडरसह भाषिक खोली एक्सप्लोर करा आणि मराठी साहित्याच्या गोडव्याला वाहिलेल्या समुदायात सामील व्हा.",
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

        footer_brand_desc: "गोडवा हे मराठी साहित्याचे डिजिटल माहेरघर आहे. मराठी कवितेचा समृद्ध वारसा जपणे आणि तंत्रज्ञाच्या माध्यमातून तिचे सौंदर्य सर्वांपर्यंत पोहोचवणे हे आमचे ध्येय आहे.",
        footer_nav_title: "नेव्हिगेशन",
        footer_foundation_title: "फाउंडेशन",
        footer_rights: "गोडवा मराठी कविता प्लॅटफॉर्म. सर्व हक्क राखीव.",
        footer_made_with: "मराठी साहित्यासाठी प्रेमाने बनवले",
        footer_links_explore: "एक्सप्लोर",
        footer_links_poets: "कवी",
        footer_links_collections: "संग्रह",
        footer_links_submit: "साहित्य पाठवा",
        footer_links_about: "आमच्याबद्दल",
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
        explore_subtitle: "मराठी कवितेचे विशाल विश्व धुंडाळा",
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

        submit_title: "साहित्य पाठवा",
        submit_subtitle: "मराठी कवितांचे सौंदर्य जगासोबत शेअर करा.",
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
    }
};
