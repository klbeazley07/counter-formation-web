import React, { useEffect, useRef, useState, useCallback } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ScriptureRef } from "./ScriptureRef";
import { renderHtmlWithScriptureRefs } from "./utils/parseScriptureRefs";

export const RULE_BASE = "/rule-of-life";

const C = {
  heroBg: "#06050A",
  darkBg: "#0E0C0A",
  ruleBg: "#17140F",
  gold:   "#C9A84C",
  ivory:  "#FAF8F5",
};

/* ─── AUTHOR PHOTOS ──────────────────────────────────────────────── */

const AUTHORS = {
  "Brother Lawrence":       { photo: "/Brother_Lawrence.jpg",  bio: "A 17th-century Carmelite friar who spent his life in a monastery kitchen and became one of the most beloved voices in Christian spiritual formation." },
  "John Mark Comer":        { photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/John_Mark_Comer_%282019%29.jpg/440px-John_Mark_Comer_%282019%29.jpg", bio: "Teacher, writer, and founder of Practicing the Way. New York Times bestselling author of The Ruthless Elimination of Hurry and Practicing the Way." },
  "Thomas Merton":          { photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Thomas_Merton_OCSO.jpg/440px-Thomas_Merton_OCSO.jpg", bio: "A Trappist monk, writer, and mystic whose prolific output on contemplative prayer and social justice shaped a generation of Christians." },
  "Henri Nouwen":           { photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Henri_Nouwen.jpg/440px-Henri_Nouwen.jpg", bio: "A Dutch Catholic priest and author of over 40 books on the spiritual life. Spent his final years as pastor at L'Arche Daybreak community in Canada." },
  "Eugene Peterson":        { photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Eugene_Peterson_%282014%29.jpg/440px-Eugene_Peterson_%282014%29.jpg", bio: "Pastor, scholar, and author of The Message Bible translation. His books on spiritual theology shaped the modern conversation on pastoral ministry." },
  "Michael Casey":          { photo: "/Michael_Casey.jpg",     bio: "A Cistercian monk of Tarrawarra Abbey, Australia, and prolific writer on monastic spirituality and lectio divina." },
  "Scot McKnight":          { photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Scot_McKnight.jpg/440px-Scot_McKnight.jpg", bio: "New Testament scholar and professor at Northern Seminary. Author of over 50 books on Jesus, Paul, and Christian community." },
  "Philip Yancey":          { photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Philip_Yancey.jpg/440px-Philip_Yancey.jpg", bio: "One of the most widely read Christian authors of our time, known for his honest and probing explorations of faith, doubt, and grace." },
  "Paul Miller":            { photo: "/Paul_Miller.jpg",       bio: "Founder of seeJesus ministry and author of A Praying Life, one of the most practical and transformative books on prayer available." },
  "Bill Hybels":            { photo: "/Bill_Hybels.jpg",       bio: "Founding pastor of Willow Creek Community Church and author of numerous books on leadership, prayer, and the local church." },
  "Tyler Staton":           { photo: "https://images.squarespace-cdn.com/content/v1/62f4240b6378f20af35390c4/44388244-0fcd-424c-adcc-4943367d71ae/Tyler-Staton.jpg", bio: "Lead pastor of Bridgetown Church in Portland, Oregon, and National Director of 24-7 Prayer USA. Author and teacher on prayer, the Holy Spirit, and the contemplative life." },
  "Thomas Keating":         { photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Thomas_Keating.jpg/440px-Thomas_Keating.jpg", bio: "Trappist monk and founder of the Centering Prayer movement, which has introduced thousands to the contemplative dimension of Christian life." },
  "Abraham Joshua Heschel": { photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Abraham_Joshua_Heschel.jpg/440px-Abraham_Joshua_Heschel.jpg", bio: "One of the leading Jewish philosophers and theologians of the 20th century. His work on Sabbath, prayer, and prophetic consciousness remains essential." },
  "A.J. Swoboda":           { photo: "/AJ_Swoboda.jpg",        bio: "Pastor, author, and professor whose work on Sabbath, creation care, and spiritual formation has made him a fresh voice in the church." },
  "Rich Villodas":          { photo: "/Rich_Villodas.jpg",     bio: "Lead pastor of New Life Fellowship in Queens, NY — one of the most ethnically diverse churches in America. Author and speaker on spiritual formation and racial reconciliation." },
  "Peter Scazzero":         { photo: "/Peter_Scazzero.jpg",    bio: "Founder of New Life Fellowship and Emotionally Healthy Discipleship, a movement helping churches integrate emotional health and contemplative spirituality." },
  "Dietrich Bonhoeffer":    { photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Dietrich_Bonhoeffer.jpg/440px-Dietrich_Bonhoeffer.jpg", bio: "German pastor, theologian, and anti-Nazi dissident who was executed in 1945. His writings on community, discipleship, and costly grace remain profoundly formative." },
  "Chuck Colson":           { photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Chuck_Colson.jpg/440px-Chuck_Colson.jpg", bio: "Former Nixon aide turned Christian author and activist, founder of Prison Fellowship. His later writing on the church as a countercultural community became prophetic." },
};

/* ─── RHYTHM DATA ─────────────────────────────────────────────────── */

export const RHYTHMS = [
  {
    slug: "presence", title: "Presence", sub: "Attention before God", rhythm: "RHYTHM 01",
    img:      "/Presence_wide.png",
    imgThumb: "/Presence_wide.png",
    quote: "Be still, and know that I am God.", quoteRef: "Psalm 46:10",
    interactiveLabel: "The Daily Examen", challengeDay: 1, challengeTitle: "You Are Being Formed",
    why: [
      "We live in the age of perpetual elsewhere. Even when our bodies are present, our attention is somewhere else — in the feed, in the inbox, in the anxious rehearsal of tomorrow.",
      "Presence is the practice of returning. Returning to the body, to the moment, to the reality that God is here — not somewhere down the road, not in some future state of spiritual achievement, but now, in this room, in this breath.",
      "The contemplative tradition has always understood that the primary spiritual problem is not immorality — it's inattention. We are absent from our own lives. And an absent person cannot love well, cannot hear God, cannot be genuinely with anyone.",
      "Brother Lawrence, a 17th-century monk who spent his life in a monastery kitchen, wrote that the practice of the presence of God was the foundation of all spiritual growth. Not grand mystical experiences, not theological mastery — just the steady, repeated act of turning the attention toward God in the middle of ordinary life.",
      "This is the first rhythm because it is the ground of all the others. Without presence, scripture becomes information rather than encounter. Prayer becomes performance rather than conversation. Sabbath becomes laziness rather than trust. Community becomes social obligation rather than genuine belonging.",
      "Presence is the soil. Everything else grows from it.",
    ],
    theology: [
      "The Hebrew concept of <em>shakan</em> — God's indwelling, the shekinah — speaks of a God who takes up residence. Not a distant deity who occasionally visits, but one who pitches his tent among his people (John 1:14). The incarnation is the ultimate act of presence — God becoming flesh, locating himself in a specific body, in a specific place, at a specific time.",
      "When Jesus is asked for the greatest commandment, his answer is not a set of behaviors but a quality of attention: <em>\"Love the Lord your God with all your heart and with all your soul and with all your mind.\"</em> All of it. The entire person oriented toward God — which is another way of describing total presence.",
      "Paul's instruction to \"pray without ceasing\" (1 Thessalonians 5:17) has confused people for centuries. The contemplatives answer: it is not about words, but about orientation. A life perpetually turned toward God, moment by moment, is a life of unceasing prayer. The practice of presence is simply the training that makes that orientation possible.",
    ],
    scriptures: [
      { t: "Be still, and know that I am God.", r: "Psalm 46:10" },
      { t: "Where can I go from your Spirit? Where can I flee from your presence?", r: "Psalm 139:7" },
      { t: "The Lord is near to all who call on him, to all who call on him in truth.", r: "Psalm 145:18" },
    ],
    practice: {
      intro: "The practice of presence is not a technique — it is a posture. But postures require training. Here are three concrete entry points:",
      steps: [
        { num: "01", title: "Breath Prayer", body: "Choose a short phrase — a name of God, a line of scripture, a simple prayer. Inhale slowly and silently speak the first half. Exhale and speak the second. \"Lord Jesus\" (inhale) / \"have mercy\" (exhale). Do this for five minutes. When your attention wanders — and it will — simply return. The returning is not failure. The returning is the practice." },
        { num: "02", title: "The Daily Examen", body: "At the end of each day, take ten minutes to review it in God's presence. Not to evaluate your performance, but to notice where God was present and where you were absent. Ask: Where did I feel most alive? Where did I feel most disconnected? What do I want to bring to God from today?" },
        { num: "03", title: "Threshold Prayers", body: "Choose two or three thresholds in your day — waking, entering the workplace, sitting down to eat, closing the laptop. At each threshold, pause for thirty seconds. Acknowledge that God is present. This is not a long prayer. It is a brief, repeated act of reorientation that, over months, begins to change the default posture of your inner life." },
      ],
    },
    reflection: [
      "When in your day do you feel most absent — most somewhere else even while your body is present?",
      "What would it mean to practice the presence of God in the most mundane parts of your week?",
      "Where have you experienced God's presence unexpectedly? What were the conditions that made you available to notice it?",
    ],
    further: [
      { title: "The Practice of the Presence of God", author: "Brother Lawrence", desc: "The foundational classic on moment-by-moment awareness of God. Brother Lawrence discovered that washing dishes in a monastery kitchen could be as sacred as kneeling at the altar — and that the presence of God was available in every moment, not just the devoted ones.", amazon: "https://www.amazon.com/Practice-Presence-God-Complete-Illustrations/dp/B0DL378TGY", cover: "https://m.media-amazon.com/images/I/71yHItaB0wL._SY522_.jpg" },
      { title: "The Ruthless Elimination of Hurry", author: "John Mark Comer", desc: "Comer's argument that hurry is the enemy of the spiritual life — and that the path to presence runs through the deliberate, sustained elimination of pace that has colonized modern life. Practical, theologically rich, and urgently needed.", amazon: "https://www.amazon.com/Ruthless-Elimination-Hurry-Emotionally-Spiritually/dp/0525653090", cover: "https://images-na.ssl-images-amazon.com/images/P/0525653090.jpg" },
      { title: "Contemplative Prayer", author: "Thomas Merton", desc: "Merton's deep guide to the interior life — what it means to be still, to listen, and to allow the noise of the self to quiet enough to hear what God is saying. Dense and rewarding for anyone serious about the practice of presence.", amazon: "https://www.amazon.com/Contemplative-Prayer-Classic-Thomas-Merton-ebook/dp/B002VD6NJ6", cover: "https://m.media-amazon.com/images/I/41XPp0B27YL.jpg" },
      { title: "The Way of the Heart", author: "Henri Nouwen", desc: "A slender but profound meditation on solitude, silence, and prayer drawn from the Desert Fathers. Nouwen argues that the heart must be formed in the desert before it can serve in the world. One of the most important short books on the interior life.", amazon: "https://www.amazon.com/Way-Heart-Connecting-Through-Silence/dp/0345463358", cover: "https://m.media-amazon.com/images/I/8138YXp4WfL._SY522_.jpg" },
    ],
    media: [
      { title: "How to Practice the Presence of God", source: "Practicing the Way", type: "Video", thumb: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=400", url: "https://www.practicingtheway.org" },
      { title: "The Ruthless Elimination of Hurry", source: "John Mark Comer Teachings · Podcast", type: "Podcast", thumb: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?q=80&w=400", url: "https://www.practicingtheway.org/resources" },
      { title: "Presence — Rule of Life Series", source: "Practicing the Way · YouTube", type: "Video", thumb: "https://images.unsplash.com/photo-1507692049790-de58290a4334?q=80&w=400", url: "https://www.practicingtheway.org" },
    ],
  },
  {
    slug: "scripture", title: "Scripture", sub: "Truth before noise", rhythm: "RHYTHM 02",
    img:      "/Scripture_wide.png",
    imgThumb: "/Scripture_wide.png",
    quote: "Your word is a lamp to my feet and a light to my path.", quoteRef: "Psalm 119:105",
    interactiveLabel: "Lectio Divina Guide", challengeDay: 2, challengeTitle: "Scripture Before the Algorithm",
    why: [
      "Every culture has a story it tells about who we are, what we're for, and what matters. The algorithm tells one story. The news tells another. The market tells a third. These stories form us — not through argument, but through repetition, image, and the subtle pressure of what gets attention.",
      "Scripture tells a different story. And the practice of reading it regularly is not primarily about information acquisition — it is about narrative formation. We are being re-storied. Our imaginations are being reoriented around a different account of reality.",
      "The early church understood this. The Psalms were sung daily. The Torah was read aloud in community. Paul's letters were circulated and read repeatedly. The assumption was not that one hearing would suffice, but that sustained, repeated immersion in the story of God would, over time, produce people whose desires, instincts, and reflexes were shaped by that story.",
      "The problem for most modern Christians is not that they have rejected scripture — it is that scripture has become one input among many rather than the primary narrative frame. We read a verse in the morning and then spend fourteen hours in a different story.",
      "Scripture before screen is not a rule. It is a recognition that what we give our first attention to has disproportionate power over the architecture of our day.",
    ],
    theology: [
      "The Hebrew word for scripture — <em>torah</em> — is often translated \"law\" but its root meaning is closer to \"instruction\" or \"direction.\" Torah is not primarily a legal code but a way of life given by a loving God to a people he is forming.",
      "Jesus' relationship to scripture is striking. He quotes it when tempted, interprets it in the sermon on the mount, fulfills it in his life and death. And yet he also says, <em>\"You search the Scriptures because you think that in them you have eternal life; and it is they that bear witness about me.\"</em> (John 5:39) Scripture's purpose is not itself — it is to lead to Christ.",
      "The Reformers spoke of <em>sola scriptura</em> — scripture alone as the ultimate authority. The contemplatives balanced this with <em>lectio divina</em> — sacred reading, in which the text is not analyzed but listened to, waited on, allowed to speak. Both instincts are correct. The word of God is authoritative and it is alive.",
    ],
    scriptures: [
      { t: "Your word is a lamp to my feet and a light to my path.", r: "Psalm 119:105" },
      { t: "All Scripture is breathed out by God and profitable for teaching, for reproof, for correction, and for training in righteousness.", r: "2 Timothy 3:16" },
      { t: "The word of God is living and active, sharper than any two-edged sword.", r: "Hebrews 4:12" },
    ],
    practice: {
      intro: "There is a significant difference between reading scripture for information and reading it for formation. Here is a simple framework for the latter:",
      steps: [
        { num: "01", title: "Lectio Divina", body: "Read a short passage slowly — four or five verses. Read it again. On the third reading, pay attention to any word or phrase that seems to catch your attention. Sit with that word in silence for several minutes. Don't analyze it. Ask: what is God saying to me through this? This is not a technique for extracting meaning. It is a posture of receptivity." },
        { num: "02", title: "Scripture Before Screen", body: "The first thirty minutes of your morning belong to God, not to the algorithm. Before the phone. Before the news. Before email. Open scripture. Even five verses, read slowly and prayerfully, create a different orientation for everything that follows." },
        { num: "03", title: "Memorization and Meditation", body: "The Psalms were memorized. The Torah was rehearsed. This is not about showing off — it is about internalizing the narrative so it becomes available to you in the moments when you need it most. Choose one verse per month. Write it on a card. Repeat it throughout the day." },
        { num: "04", title: "Communal Reading", body: "Scripture was never meant to be read in isolation. Read it with someone. Ask them what they notice. Let their reading illuminate yours. The body of Christ is a hermeneutical community — we interpret the text together, and we need each other to see what we cannot see alone." },
      ],
    },
    reflection: [
      "What story are you currently living inside of? What narrative most shapes your sense of what matters, what to fear, what to hope for?",
      "When you read scripture, do you approach it as a text to be mastered or a voice to be heard?",
      "Is there a passage of scripture that has genuinely changed you — not just informed you but formed you?",
    ],
    further: [
      { title: "Eat This Book", author: "Eugene Peterson", desc: "Peterson's case for reading scripture as a spiritual practice, not a scholarly exercise. He introduces lectio divina to a modern audience and argues that the goal of Bible reading is not information but transformation — letting the text read us as much as we read it.", amazon: "https://www.amazon.com/Eat-This-Book-Conversation-Spiritual/dp/0802864902", cover: "https://m.media-amazon.com/images/I/81puBsD3mkL._SY522_.jpg" },
      { title: "Sacred Reading", author: "Michael Casey", desc: "A modern guide to the ancient practice of lectio divina from a Cistercian monk. Casey unpacks the four movements of sacred reading with theological depth and practical clarity. Essential for anyone serious about letting scripture form rather than merely inform.", amazon: "https://www.amazon.com/s?k=Sacred+Reading+Michael+Casey&i=stripbooks", cover: "https://m.media-amazon.com/images/I/71r61KVcI8L._SY522_.jpg" },
      { title: "God Has a Name", author: "John Mark Comer", desc: "A deep dive into Exodus 34 and the self-revelation of God's character. Comer shows what it looks like to encounter scripture as a revelation of who God actually is — and how that encounter reshapes everything about how we live.", amazon: "https://www.amazon.com/God-Has-Name-Believe-Become/dp/1400249589", cover: "https://m.media-amazon.com/images/I/31aWLJhjXHL._SY445_SX342_FMwebp_.jpg" },
      { title: "The Blue Parakeet", author: "Scot McKnight", desc: "McKnight helps readers understand how to read the Bible wisely — not just literally or allegorically, but in a way that honors both its authority and its humanity. A practical guide to reading the whole story well.", amazon: "https://www.amazon.com/Blue-Parakeet-2nd-Rethinking-Bible/dp/0310538920", cover: "https://m.media-amazon.com/images/I/71y6jOmuMhL._SY522_.jpg" },
    ],
    media: [
      { title: "Scripture Before Scroll — Field Guide", source: "Counter Formation", type: "Article", thumb: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=400", url: "/field-guide/scripture-before-scroll" },
      { title: "How to Read the Bible", source: "BibleProject · YouTube", type: "Video", thumb: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=400", url: "https://bibleproject.com" },
      { title: "Lectio Divina — Ancient Practice for Today", source: "Practicing the Way · Podcast", type: "Podcast", thumb: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?q=80&w=400", url: "https://www.practicingtheway.org/resources" },
    ],
  },
  {
    slug: "prayer", title: "Prayer", sub: "Dependence before action", rhythm: "RHYTHM 03",
    img:      "/Prayer_wide.png",
    imgThumb: "/Prayer_wide.png",
    quote: "Very early in the morning, while it was still dark, Jesus got up, left the house and went off to a solitary place, where he prayed.", quoteRef: "Mark 1:35",
    interactiveLabel: "Prayer Postures", challengeDay: 4, challengeTitle: "What You Hold Onto",
    why: [
      "Prayer is the most countercultural thing a person can do in a productivity-obsessed culture. It is an act of deliberate uselessness — stopping what you are doing in order to speak to and listen to a God you cannot see, whose response you cannot control, whose timing is not yours.",
      "And yet Jesus prayed. Constantly. Habitually. Before decisions (Luke 6:12). After ministry (Mark 1:35). In grief (Matthew 26:36). In dependence (John 17). The disciples — watching a man who clearly had access to divine power — did not ask him to teach them to heal or to preach. They asked him to teach them to pray.",
      "Prayer is the practice of dependence. It is the repeated, embodied acknowledgment that we are not self-sufficient — that we need God not just in crisis but in the ordinary hours of ordinary days.",
      "Most people who say they struggle with prayer are not struggling with the mechanics of prayer. They are struggling with the underlying posture — the acknowledgment that they are not in charge, that outcomes are not in their hands, that asking is not weakness but wisdom.",
      "Prayer does not change God. But it changes us. It repositions us in relation to reality — from the center of our own story to the posture of a creature before a Creator who is good.",
    ],
    theology: [
      "The Lord's Prayer (Matthew 6:9–13) is not a formula but a grammar — a structure that teaches us how to orient ourselves before God. It begins with the Father's name and kingdom before it comes to our needs. We do not come to God leading with our agenda. We come acknowledging his.",
      "Paul's instruction to \"pray without ceasing\" (1 Thessalonians 5:17) places prayer not as an activity that interrupts life but as the posture that undergirds it. The Desert Fathers spoke of making the entire day a prayer — not by reciting words constantly but by maintaining an interior orientation of dependence and openness toward God.",
      "James 5:16 speaks of \"the prayer of a righteous person\" having great power. The context is striking — it is the prayer of people praying for one another, interceding in community. Much of the prayer tradition in scripture is communal. Personal prayer is essential. But it was never meant to exist in isolation from the praying community.",
    ],
    scriptures: [
      { t: "Do not be anxious about anything, but in everything by prayer and supplication with thanksgiving let your requests be made known to God.", r: "Philippians 4:6" },
      { t: "The Spirit helps us in our weakness. For we do not know what to pray for as we ought, but the Spirit himself intercedes for us.", r: "Romans 8:26" },
      { t: "Ask, and it will be given to you; seek, and you will find; knock, and it will be opened to you.", r: "Matthew 7:7" },
    ],
    practice: {
      intro: "Prayer is less a skill to be acquired and more a relationship to be cultivated. These are invitations into different dimensions of that relationship:",
      steps: [
        { num: "01", title: "The Daily Office", body: "Fixed-hour prayer is one of the oldest disciplines in the Christian tradition — the monastic practice of stopping at set times each day to pray. Morning, midday, evening, night. Choose two fixed times each day and protect them. The phone goes down. You stop. You pray. Not because you feel like it, but because you have decided that this is what your life is organized around." },
        { num: "02", title: "The ACTS Structure", body: "Adoration — begin by acknowledging who God is, not what you want. Confession — be honest about where you have fallen short or drifted. Thanksgiving — name three specific things from the last 24 hours. Supplication — bring your requests. This structure prevents prayer from becoming exclusively a wish list." },
        { num: "03", title: "Contemplative Prayer", body: "Choose a short phrase — \"Here I am,\" \"Come, Lord Jesus,\" \"Into your hands.\" Sit in silence. When your mind wanders — and it will — return to the phrase. Not as a mantra to achieve altered states, but as a gentle return to intention. This trains the capacity to be still and to listen." },
        { num: "04", title: "Intercessory Prayer", body: "Keep a written list of people you are praying for — five to ten names. Pray through it slowly. As you name each person, hold them in God's presence. Ask for their flourishing. Intercession is one of the most concrete ways we can love people who are not in the room." },
      ],
    },
    reflection: [
      "What is your actual current relationship with prayer — not what you think it should be, but what it honestly is?",
      "Where do you feel most resistant to prayer? What does that resistance tell you about what you are holding onto?",
      "If prayer genuinely changes the one who prays, what would a person who prays regularly look like?",
    ],
    further: [
      { title: "Prayer", author: "Philip Yancey", desc: "Yancey's most personal and probing book — an honest investigation into why prayer feels difficult, what the Bible actually promises, and how to develop a sustainable, honest practice. Particularly helpful for people who feel their prayers bounce off the ceiling.", amazon: "https://www.amazon.com/Prayer-Does-Make-Any-Difference/dp/031034509X", cover: "https://m.media-amazon.com/images/I/41dcO27RPZL._SY445_SX342_FMwebp_.jpg" },
      { title: "A Praying Life", author: "Paul Miller", desc: "Miller dismantles the idea that prayer requires a special spiritual state and shows instead how honest, child-like asking is at the heart of what Jesus modeled. One of the most practically transformative books on prayer available.", amazon: "https://www.amazon.com/Praying-Life-Connecting-Distracting-World/dp/1631466836", cover: "https://m.media-amazon.com/images/I/511XbuckwdL._SY445_SX342_FMwebp_.jpg" },
      { title: "Too Busy Not to Pray", author: "Bill Hybels", desc: "A short, accessible classic that addresses the most common barrier to prayer — the feeling that there is no time. Hybels argues persuasively that the busier life becomes, the more essential prayer is, not less.", amazon: "https://www.amazon.com/Too-Busy-Pray-Bill-Hybels/dp/0830834753", cover: "https://m.media-amazon.com/images/I/81APUZaKT4L._SY522_.jpg" },
      { title: "Open Mind, Open Heart", author: "Thomas Keating", desc: "Keating's introduction to centering prayer — the contemplative practice of resting in God's presence beyond words and images. For those who want to go deeper than petition into the silent receptivity at the heart of Christian prayer.", amazon: "https://www.amazon.com/Open-Mind-Heart-20th-Anniversary/dp/1472972090", cover: "https://m.media-amazon.com/images/I/917HBcbg7-L._SY522_.jpg" },
      { title: "Praying Like Monks, Living Like Fools", author: "Tyler Staton", desc: "Staton dismantles the barriers that keep modern people from prayer and rebuilds a vision of it as the most honest, subversive, and transformative act available to us. Practical, theologically grounded, and deeply readable.", amazon: "https://www.amazon.com/Praying-Like-Monks-Living-Fools/dp/031036535X", cover: "https://m.media-amazon.com/images/I/81s-q8hkVWL._SY522_.jpg" },
    ],
    media: [
      { title: "Why We Pray — John Mark Comer", source: "Practicing the Way · YouTube", type: "Video", thumb: "https://images.unsplash.com/photo-1473172707857-f9e276582ab6?q=80&w=400&crop=top", url: "https://www.practicingtheway.org/resources" },
      { title: "John Mark Comer Teachings — Prayer Series", source: "Practicing the Way · Podcast", type: "Podcast", thumb: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?q=80&w=400", url: "https://www.practicingtheway.org/resources" },
      { title: "The Lord's Prayer — BibleProject", source: "BibleProject · YouTube", type: "Video", thumb: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=400", url: "https://bibleproject.com" },
    ],
  },
  {
    slug: "sabbath", title: "Sabbath", sub: "Rest before production", rhythm: "RHYTHM 04",
    img:      "/Sabbath_wide.png",
    imgThumb: "/Sabbath_wide.png",
    quote: "Remember the Sabbath day by keeping it holy. Six days you shall labor and do all your work, but the seventh day is a sabbath to the Lord your God.", quoteRef: "Exodus 20:8–10",
    interactiveLabel: "Sabbath Ideas", challengeDay: 7, challengeTitle: "Build a Life That Forms You",
    why: [
      "Sabbath is perhaps the most countercultural practice in this guide. In a culture that equates productivity with virtue and busyness with importance, stopping for an entire day is a radical act.",
      "But that is precisely the point. Sabbath is not primarily a wellness practice or a productivity strategy — it is a theological declaration. By stopping, you are saying with your body what you may believe with your mind but struggle to live: God is in charge. The world does not depend on me. I am a creature, not a creator. I can rest because he does not.",
      "The Sabbath commandment is embedded in the story of creation (Genesis 2:1–3) and the story of liberation (Deuteronomy 5:15). God rested after creation — not because he was tired, but as a pattern for his creatures to follow. And the Israelites were commanded to rest as a reminder that they were no longer slaves.",
      "Walter Brueggemann has written that Sabbath is \"the practical gospel alternative to the anxiety of the market.\" The market never stops. The notifications never stop. The economy of more, faster, better never rests. Sabbath is the practiced refusal of that economy for one day a week.",
      "Most people who try to practice Sabbath discover, within a few weeks, that they cannot easily stop. The anxiety of unfinished tasks, the fear of falling behind, the discomfort of being unproductive — these surface quickly. That anxiety is worth sitting with, because it reveals what has actually been forming us.",
    ],
    theology: [
      "The Hebrew word <em>shabbat</em> means to stop, to cease, to rest. God's rest in Genesis 2 is not passive inactivity — it is the enjoyment and blessing of what has been made. Sabbath is the day set apart for delight, for worship, for unhurried presence with God and with people.",
      "Jesus said, <em>\"The Sabbath was made for man, not man for the Sabbath.\"</em> (Mark 2:27) This is not permission to ignore Sabbath — it is a correction of legalism. The Sabbath is a gift, not a burden. The question is not \"What am I not allowed to do?\" but \"What does it look like to genuinely rest, delight, and trust?\"",
      "John Mark Comer distills Sabbath into four movements: Stop. Rest. Delight. Worship. All four are necessary. Stop means actually ceasing from work — not mentally checking out while still producing. Rest means sleep, stillness, the recovery of the body. Delight means enjoying what God has made. Worship means orienting the day toward God in gathered community.",
    ],
    scriptures: [
      { t: "Remember the Sabbath day by keeping it holy.", r: "Exodus 20:8" },
      { t: "The Sabbath was made for man, not man for the Sabbath.", r: "Mark 2:27" },
      { t: "Come to me, all who labor and are heavy laden, and I will give you rest.", r: "Matthew 11:28" },
    ],
    practice: {
      intro: "Sabbath is not a single practice but a whole-day posture. Here is a framework for beginning:",
      steps: [
        { num: "01", title: "Choose a Day and Protect It", body: "Sabbath requires a decision made in advance and protected with intention. Choose your day. Put it in the calendar. The battle for Sabbath is won or lost before the day arrives — in the decisions you make about what to finish on the day before and what you are willing to leave undone." },
        { num: "02", title: "Begin and End with Ritual", body: "Much of the Sabbath is about rhythms and rituals that set the day apart as holy. Light candles. Pour a glass of wine. Gather around a table. Pray to begin. These rituals signal to your body and soul that you have crossed a threshold — that this time belongs to God, not to production." },
        { num: "03", title: "Stop Work Completely", body: "This means more than not going to the office. Not checking email. Not returning to the project in your head. The test is simple: are you producing anything? If yes, it is not Sabbath. The anxiety that surfaces when you stop is not a sign that you need to keep working — it is a sign of how much formation work still needs to be done." },
        { num: "04", title: "Delight Intentionally", body: "Abraham Joshua Heschel called Sabbath \"a palace in time.\" Ask yourself: what do I genuinely enjoy that I never have time for? What makes me feel most alive? Do that. John Mark Comer offers a simple test for every Sabbath activity: is it restful or worshipful? If not, it can wait until Monday." },
      ],
    },
    reflection: [
      "What happens inside you when you try to stop working? What does that reaction reveal about what is forming you?",
      "What would genuine delight look like for you on a Sabbath? When did you last spend a full day doing what you love, without guilt?",
      "What would you have to believe about God — really believe, not just intellectually affirm — in order to rest fully?",
    ],
    further: [
      { title: "The Sabbath", author: "Abraham Joshua Heschel", desc: "The most beautiful book ever written about Sabbath. Heschel, a Jewish theologian, describes Sabbath not as a day of restriction but as a cathedral built in time — the most sacred architecture in Jewish life. His phrase \"a palace in time\" alone is worth the read.", amazon: "https://www.amazon.com/Sabbath-Classics-Abraham-Joshua-Heschel/dp/0374529752", cover: "https://m.media-amazon.com/images/I/811QpvHSIhL._SY522_.jpg" },
      { title: "The Sabbath Practice", author: "John Mark Comer", desc: "Comer's practical companion guide from Practicing the Way — the four-session course that walks individuals and communities through Stop, Rest, Delight, and Worship. The most accessible entry point into a real Sabbath practice for modern people.", amazon: "https://www.amazon.com/Sabbath-Practice-Four-Session-Companion-Delight/dp/0593603257", cover: "https://m.media-amazon.com/images/I/61IdPrpDlgL._SY522_.jpg" },
      { title: "Garden City", author: "John Mark Comer", desc: "Comer's theology of work and rest — why we work, what work is for, and how Sabbath fits into the larger story of what it means to be human. Essential reading for anyone who struggles to separate their identity from their productivity.", amazon: "https://www.amazon.com/Garden-City-Work-Being-Human/dp/1400257220", cover: "https://m.media-amazon.com/images/I/61OfN8H-H8L._SY522_.jpg" },
      { title: "Subversive Sabbath", author: "A.J. Swoboda", desc: "Swoboda makes the case that Sabbath is not a personal preference but a political act — a weekly declaration that humans are not machines, that the economy does not have the last word, that rest is resistance. Prophetic and practical.", amazon: "https://www.amazon.com/Subversive-Sabbath-Surprising-Power-Nonstop/dp/1587434059", cover: "https://m.media-amazon.com/images/I/41WcHzkzToL._SY445_SX342_FMwebp_.jpg" },
    ],
    media: [
      { title: "Sabbath — Stop, Rest, Delight, Worship", source: "Practicing the Way · YouTube", type: "Video", thumb: "https://images.unsplash.com/photo-1519834785169-98be25ec3f84?q=80&w=400", url: "https://www.practicingtheway.org/resources" },
      { title: "The Sabbath Practice Course", source: "Practicing the Way · Course", type: "Course", thumb: "https://images.unsplash.com/photo-1472396961693-142e6e269027?q=80&w=400", url: "https://www.practicingtheway.org" },
      { title: "Why Sabbath is Resistance", source: "John Mark Comer Teachings · Podcast", type: "Podcast", thumb: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?q=80&w=400", url: "https://www.practicingtheway.org/resources" },
    ],
  },
  {
    slug: "community", title: "Community", sub: "Formation together", rhythm: "RHYTHM 05",
    img:      "/Community_wide.png",
    imgThumb: "/Community_wide.png",
    quote: "They devoted themselves to the apostles' teaching and to fellowship, to the breaking of bread and to prayer.", quoteRef: "Acts 2:42",
    interactiveLabel: "Depths of Community", challengeDay: 6, challengeTitle: "You Cannot Do This Alone",
    why: [
      "We live in an era of unprecedented connection and epidemic loneliness. We have more ways to communicate with more people than any generation in history — and research consistently shows that people are more isolated, more unknown, and more alone than ever before.",
      "The church was never meant to be a broadcast medium. It was meant to be a body — an organism in which people are genuinely known, genuinely accountable, and genuinely in one another's lives. Not as a social preference, but as a theological necessity.",
      "The doctrine of the Trinity — Father, Son, and Spirit in eternal, mutual self-giving love — suggests that community is not a human invention but a reflection of God's own inner life. We were made in the image of a God who is inherently relational. Isolation is not neutral — it is a kind of theological malformation.",
      "You cannot become like Jesus alone. This is not a motivational claim — it is an observation about how transformation actually works. Jesus did not mail letters to the twelve. He lived with them. Proximity — genuine, sustained, unhurried proximity — is the environment in which formation happens.",
      "The question is not whether you have community. Everyone has some kind of community. The question is whether your community is oriented around formation.",
    ],
    theology: [
      "The New Testament's vision of the church is captured in its use of the word <em>ekklesia</em> — the assembled people called out and called together. The letter to the Hebrews warns against \"giving up meeting together\" (10:25) not because gathering is a rule to follow but because it is a necessity of life. A body part that has separated from the body dies.",
      "Paul's metaphor of the body (1 Corinthians 12) makes the interdependence explicit: \"The eye cannot say to the hand, 'I don't need you!'\" Every member is necessary. Every member is vulnerable. This is not the vision of a religious social club — it is the vision of a people so deeply committed to one another that their lives are genuinely shared.",
      "The \"one another\" commands of the New Testament are remarkable in their scope: love one another, serve one another, bear one another's burdens, confess your sins to one another, pray for one another. These commands cannot be fulfilled at a distance. They require presence, trust, and a willingness to be known that most of us spend considerable energy avoiding.",
    ],
    scriptures: [
      { t: "They devoted themselves to the apostles' teaching and to fellowship, to the breaking of bread and to prayer.", r: "Acts 2:42" },
      { t: "Bear one another's burdens, and so fulfill the law of Christ.", r: "Galatians 6:2" },
      { t: "And let us consider how to stir up one another to love and good works, not neglecting to meet together.", r: "Hebrews 10:24–25" },
    ],
    practice: {
      intro: "Community is not found — it is built. It requires initiative, vulnerability, and sustained commitment. Here are the foundational practices:",
      steps: [
        { num: "01", title: "Find a Small Community", body: "The Sunday gathering is essential but insufficient. Find or form a group of four to eight people committed to meeting regularly — weekly or biweekly — with an explicit purpose of spiritual formation. Not a Bible study that ends in information. A community with an agreed commitment to honesty, accountability, and shared formation." },
        { num: "02", title: "Practice Radical Honesty", body: "The deepest barrier to genuine community is not schedule or geography — it is the curated self. Most of us present a version of ourselves carefully edited for public consumption. The practice of radical honesty — sharing not the polished version but the real one — is terrifying and transformative." },
        { num: "03", title: "Ask Better Questions", body: "\"How are you doing?\" is not a real question. Practice asking questions that require real answers: What has been hardest for you this week? Where have you felt God's presence? What are you afraid of right now? These questions create space for genuine encounter — which is the material community is made of." },
        { num: "04", title: "Show Up Consistently", body: "Community is built over years, not weeks. The people who know you best are the people who have seen you across multiple seasons of life. This requires the most underrated virtue in community: showing up when you do not feel like it. Commitment that is contingent on how you feel is not commitment — it is preference." },
      ],
    },
    reflection: [
      "Are you currently known — actually known — by anyone? Not known about, but known?",
      "What would you have to risk in order to move from acquaintance to genuine community?",
      "What kind of community are you helping to create for others?",
    ],
    further: [
      { title: "Life Together", author: "Dietrich Bonhoeffer", desc: "The most important book ever written about Christian community. Bonhoeffer, writing from a clandestine seminary in Nazi Germany, dismantles the fantasy of ideal community and shows what genuine, grace-based life together actually looks like. Short, dense, essential.", amazon: "https://www.amazon.com/Life-Together-Exploration-Christian-Community/dp/B0FHWWH7Y2", cover: "https://m.media-amazon.com/images/I/41VLz4wzqrL._SY445_SX342_FMwebp_.jpg" },
      { title: "The Deeply Formed Life", author: "Rich Villodas", desc: "Villodas weaves together contemplative spirituality, racial reconciliation, and sexual wholeness into a vision of community that goes deeper than most churches dare. A compelling portrait of what formation in community can actually look like.", amazon: "https://www.amazon.com/Deeply-Formed-Life-Transformative-Values/dp/0525654402", cover: "https://m.media-amazon.com/images/I/41hmZWxVQZL._SY445_SX342_FMwebp_.jpg" },
      { title: "Emotionally Healthy Spirituality", author: "Peter Scazzero", desc: "Scazzero's argument that most Christian community is emotionally shallow — and that genuine transformation requires the kind of honesty, grief, and self-awareness that most churches actively avoid. One of the most practically impactful books on community formation.", amazon: "https://www.amazon.com/Emotionally-Healthy-Spirituality-Impossible-Spiritually/dp/0310348498", cover: "https://m.media-amazon.com/images/I/71c9eht02hL._SY522_.jpg" },
      { title: "The Body", author: "Chuck Colson", desc: "Colson's sweeping vision of the church as a distinct, countercultural community — called not to reflect the culture but to embody an alternative. A prophetic call to take the communal nature of Christian life seriously in a fragmenting world.", amazon: "https://www.amazon.com/Being-Body-Charles-Colson/dp/0849917522", cover: "https://m.media-amazon.com/images/I/81F1eqcBQuL._SY522_.jpg" },
    ],
    media: [
      { title: "Community — Why You Can't Grow Alone", source: "Practicing the Way · YouTube", type: "Video", thumb: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=400", url: "https://www.practicingtheway.org/resources" },
      { title: "Formation Together — Counter Formation", source: "Counter Formation · Article", type: "Article", thumb: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=400", url: "/" },
      { title: "Emotionally Healthy Discipleship Podcast", source: "Peter Scazzero · Podcast", type: "Podcast", thumb: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?q=80&w=400", url: "https://www.emotionallyhealthy.org" },
    ],
  },
];

/* ─── STORAGE HELPERS ─────────────────────────────────────────────── */

function getBookProgress() {
  try { return JSON.parse(localStorage.getItem("cf_books") || "{}"); }
  catch { return {}; }
}

/* ─── INTERACTIVE: EXAMEN WALKTHROUGH (Presence) ─────────────────── */

function ExamenWalkthrough() {
  const STEPS = [
    {
      num: "01", title: "Gratitude", latin: "Gratitudo",
      prompt: "Pause and look back over the last 24 hours. What are you genuinely grateful for? Name one specific thing — not a category, but a moment, a person, a gift.",
      cue: "Begin in gratitude. Not because life is easy, but because God is present.",
    },
    {
      num: "02", title: "Presence", latin: "Conscientia",
      prompt: "Where did you feel most alive today? Where did you sense God near — in a conversation, a moment of beauty, a quiet awareness? Where did you feel most connected to what matters?",
      cue: "Notice where God was present — even where you weren't looking.",
    },
    {
      num: "03", title: "Sorrow", latin: "Contritio",
      prompt: "Where did you fall short today? Not to generate shame, but to see clearly. Where did you drift — in attention, in love, in obedience? Name it honestly before God.",
      cue: "Honesty is not self-punishment. It is the beginning of return.",
    },
    {
      num: "04", title: "Forgiveness", latin: "Remissio",
      prompt: "Bring what you named in sorrow to God. Receive his forgiveness — not as a feeling, but as a fact. Is there anyone you need to forgive, or anyone you need to seek forgiveness from?",
      cue: "You are not what you did today. You are who God says you are.",
    },
    {
      num: "05", title: "Resolve", latin: "Propositum",
      prompt: "What do you want to carry into tomorrow? One thing to do differently, one person to love better, one practice to protect. Make it specific. Tell God.",
      cue: "Tomorrow is not yet formed. You still get to choose what shapes it.",
    },
  ];

  const [step, setStep] = useState(0);
  const [notes, setNotes] = useState(Array(STEPS.length).fill(""));
  const [done, setDone] = useState(false);
  const [started, setStarted] = useState(false);

  const cur = STEPS[step];
  const isLast = step === STEPS.length - 1;

  const handleNext = () => { if (isLast) setDone(true); else setStep(s => s + 1); };
  const handleBack = () => { if (step > 0) setStep(s => s - 1); };
  const handleRestart = () => { setStep(0); setNotes(Array(STEPS.length).fill("")); setDone(false); setStarted(false); };

  const base = { fontFamily: "'Barlow Condensed',sans-serif" };

  if (!started) return (
    <div style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "24px", padding: "3rem 2rem", textAlign: "center" }}>
      <p style={{ ...base, fontSize: "9px", letterSpacing: ".42em", textTransform: "uppercase", color: "rgba(201,168,76,0.7)", marginBottom: "1.5rem" }}>The Daily Examen · Ignatian Practice</p>
      <p style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic", fontSize: "20px", color: "rgba(250,248,245,0.75)", lineHeight: 1.7, maxWidth: "480px", margin: "0 auto 1.5rem" }}>
        "At the end of each day, take ten minutes to review it in God's presence."
      </p>
      <p style={{ ...base, fontSize: "9px", letterSpacing: ".2em", textTransform: "uppercase", color: "rgba(250,248,245,0.3)", marginBottom: "2.5rem" }}>5 steps · ~10 minutes · Gratitude → Presence → Sorrow → Forgiveness → Resolve</p>
      <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginBottom: "2.5rem" }}>
        {STEPS.map((s, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "50%", border: "1px solid rgba(201,168,76,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px", color: "rgba(201,168,76,0.6)", ...base }}>{s.num}</div>
            <span style={{ fontSize: "7px", letterSpacing: ".2em", textTransform: "uppercase", color: "rgba(250,248,245,0.25)", ...base }}>{s.title}</span>
          </div>
        ))}
      </div>
      <button onClick={() => setStarted(true)} style={{ padding: "14px 40px", borderRadius: "999px", border: "2px solid rgba(201,168,76,0.5)", background: "rgba(201,168,76,0.1)", color: "#C9A84C", ...base, fontSize: "10px", letterSpacing: ".3em", textTransform: "uppercase", cursor: "pointer", transition: "all .25s", fontWeight: 700 }}
        onMouseEnter={e => { e.target.style.background = "rgba(201,168,76,0.2)"; e.target.style.borderColor = "#C9A84C"; }}
        onMouseLeave={e => { e.target.style.background = "rgba(201,168,76,0.1)"; e.target.style.borderColor = "rgba(201,168,76,0.5)"; }}>
        Begin the Examen
      </button>
    </div>
  );

  if (done) return (
    <div style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "24px", padding: "3rem 2rem", textAlign: "center" }}>
      <p style={{ ...base, fontSize: "9px", letterSpacing: ".42em", textTransform: "uppercase", color: "rgba(201,168,76,0.7)", marginBottom: "1.5rem" }}>Examen Complete</p>
      <p style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic", fontSize: "22px", color: "rgba(250,248,245,0.82)", lineHeight: 1.6, marginBottom: "1rem" }}>
        You have reviewed this day in God's presence.
      </p>
      <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "16px", color: "rgba(250,248,245,0.45)", lineHeight: 1.7, maxWidth: "420px", margin: "0 auto 2.5rem" }}>
        This is how formation happens — not by intensity, but by the daily, faithful act of return. Come back tomorrow.
      </p>
      <p style={{ ...base, fontSize: "9px", letterSpacing: ".3em", textTransform: "uppercase", color: "rgba(250,248,245,0.2)", marginBottom: "2rem" }}>— <ScriptureRef reference="Psalm 139:23–24" text="Search me, O God, and know my heart; test me and know my anxious thoughts. See if there is any offensive way in me, and lead me in the way everlasting." /></p>
      <button onClick={handleRestart} style={{ padding: "12px 32px", borderRadius: "999px", border: "1px solid rgba(255,255,255,0.12)", background: "transparent", color: "rgba(250,248,245,0.4)", ...base, fontSize: "9px", letterSpacing: ".28em", textTransform: "uppercase", cursor: "pointer" }}>
        Begin Again
      </button>
    </div>
  );

  return (
    <div style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "24px", overflow: "hidden" }}>
      <div style={{ height: "2px", background: "rgba(255,255,255,0.06)" }}>
        <div style={{ height: "100%", width: `${((step + 1) / STEPS.length) * 100}%`, background: "linear-gradient(to right, #C9A84C, rgba(201,168,76,0.5))", transition: "width .4s ease" }} />
      </div>
      <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        {STEPS.map((s, i) => (
          <button key={i} onClick={() => setStep(i)} className="rl-examen-tab" style={{ flex: 1, padding: "12px 4px", border: "none", background: step === i ? "rgba(201,168,76,0.1)" : "transparent", borderBottom: step === i ? "2px solid #C9A84C" : "2px solid transparent", cursor: "pointer", ...base, fontSize: "8px", letterSpacing: ".18em", textTransform: "uppercase", color: i <= step ? (step === i ? "#C9A84C" : "rgba(201,168,76,0.5)") : "rgba(250,248,245,0.2)", transition: "all .2s" }}>
            {s.title}
          </button>
        ))}
      </div>
      <div style={{ padding: "2rem" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "14px", marginBottom: "1.5rem" }}>
          <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "42px", color: "rgba(201,168,76,0.25)", lineHeight: 1 }}>{cur.num}</span>
          <div>
            <p style={{ ...base, fontSize: "22px", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".1em", color: "#FAF8F5", lineHeight: 1 }}>{cur.title}</p>
            <p style={{ ...base, fontSize: "9px", letterSpacing: ".3em", textTransform: "uppercase", color: "rgba(201,168,76,0.55)", marginTop: "3px" }}>{cur.latin}</p>
          </div>
        </div>
        <p style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic", fontSize: "16px", color: "rgba(250,248,245,0.45)", lineHeight: 1.7, marginBottom: "1.25rem", borderLeft: "2px solid rgba(201,168,76,0.3)", paddingLeft: "1rem" }}>{cur.cue}</p>
        <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "18px", color: "rgba(250,248,245,0.78)", lineHeight: 1.82, marginBottom: "1.5rem" }}>{cur.prompt}</p>
        <textarea
          value={notes[step]}
          onChange={e => { const n = [...notes]; n[step] = e.target.value; setNotes(n); }}
          placeholder="Write your response here, or simply sit in silence..."
          rows={4}
          style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "1rem", color: "rgba(250,248,245,0.7)", fontFamily: "'Cormorant Garamond',serif", fontSize: "16px", lineHeight: 1.7, resize: "none", outline: "none", transition: "border-color .2s", boxSizing: "border-box" }}
          onFocus={e => { e.target.style.borderColor = "rgba(201,168,76,0.4)"; }}
          onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.5rem" }}>
          <button onClick={handleBack} disabled={step === 0} style={{ padding: "10px 22px", borderRadius: "999px", border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "rgba(250,248,245,0.35)", ...base, fontSize: "9px", letterSpacing: ".2em", textTransform: "uppercase", cursor: step === 0 ? "not-allowed" : "pointer", opacity: step === 0 ? .3 : 1 }}>← Back</button>
          <span style={{ ...base, fontSize: "8px", letterSpacing: ".3em", textTransform: "uppercase", color: "rgba(250,248,245,0.2)" }}>{step + 1} of {STEPS.length}</span>
          <button onClick={handleNext} style={{ padding: "10px 22px", borderRadius: "999px", border: "none", background: "#C9A84C", color: "#0A0A0A", ...base, fontSize: "9px", letterSpacing: ".2em", textTransform: "uppercase", cursor: "pointer", fontWeight: 700, transition: "background .2s" }}
            onMouseEnter={e => { e.target.style.background = "#FAF8F5"; }}
            onMouseLeave={e => { e.target.style.background = "#C9A84C"; }}>
            {isLast ? "Complete" : "Continue →"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── INTERACTIVE: LECTIO DIVINA (Scripture) ─────────────────────── */

function LectioDivinaGuide() {
  const steps = [
    { num: "I", latin: "Lectio", eng: "Read", desc: "Read the passage slowly, aloud if possible. Read it again. A third time. You are not looking for information — you are listening for a word or phrase that seems to press against you." },
    { num: "II", latin: "Meditatio", eng: "Reflect", desc: "Take the word or phrase that caught you. Repeat it quietly. Turn it over. Let it interact with your memory, your imagination, your current situation. Don't analyze — ruminate, like an animal chewing cud." },
    { num: "III", latin: "Oratio", eng: "Respond", desc: "Let what has arisen in meditation move you to prayer. Speak to God — in gratitude, petition, confession, praise. This is not a structured prayer. It is a spontaneous response to what God has stirred in you." },
    { num: "IV", latin: "Contemplatio", eng: "Rest", desc: "Release all thoughts, words, and images. Simply rest in God's presence. You are not trying to achieve anything. You are resting in the love of the One who has spoken. Even five minutes of this silence is more valuable than it seems." },
  ];
  const [active, setActive] = useState(0);
  const cur = steps[active];
  return (
    <div style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "24px", overflow: "hidden" }}>
      <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        {steps.map((s, i) => (<button key={i} onClick={() => setActive(i)} style={{ flex: 1, padding: "16px 8px", border: "none", background: active === i ? "rgba(201,168,76,0.1)" : "transparent", borderBottom: active === i ? "2px solid #C9A84C" : "2px solid transparent", cursor: "pointer", fontFamily: "'Barlow Condensed',sans-serif", fontSize: "9px", letterSpacing: ".2em", textTransform: "uppercase", color: active === i ? "#C9A84C" : "rgba(250,248,245,0.3)", transition: "all .2s" }}>{s.latin}</button>))}
      </div>
      <div style={{ padding: "2.5rem 2rem" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "16px", marginBottom: "1.25rem" }}>
          <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "36px", color: "rgba(201,168,76,0.4)" }}>{cur.num}</span>
          <div><p style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: "22px", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".1em", color: "#FAF8F5" }}>{cur.eng}</p><p style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: "9px", letterSpacing: ".3em", textTransform: "uppercase", color: "rgba(201,168,76,0.6)" }}>{cur.latin}</p></div>
        </div>
        <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "18px", lineHeight: 1.82, color: "rgba(250,248,245,0.7)" }}>{cur.desc}</p>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2rem" }}>
          <button onClick={() => setActive(i => Math.max(0, i - 1))} disabled={active === 0} style={{ padding: "10px 24px", borderRadius: "999px", border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "rgba(250,248,245,0.35)", fontFamily: "'Barlow Condensed',sans-serif", fontSize: "9px", letterSpacing: ".2em", textTransform: "uppercase", cursor: active === 0 ? "not-allowed" : "pointer", opacity: active === 0 ? .3 : 1 }}>← Prev</button>
          <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: "8px", letterSpacing: ".3em", textTransform: "uppercase", color: "rgba(250,248,245,0.2)", alignSelf: "center" }}>{active + 1} of {steps.length}</span>
          <button onClick={() => setActive(i => Math.min(steps.length - 1, i + 1))} disabled={active === steps.length - 1} style={{ padding: "10px 24px", borderRadius: "999px", border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "rgba(250,248,245,0.35)", fontFamily: "'Barlow Condensed',sans-serif", fontSize: "9px", letterSpacing: ".2em", textTransform: "uppercase", cursor: active === steps.length - 1 ? "not-allowed" : "pointer", opacity: active === steps.length - 1 ? .3 : 1 }}>Next →</button>
        </div>
      </div>
    </div>
  );
}

/* ─── INTERACTIVE: PRAYER POSTURES (Prayer) ──────────────────────── */

function PrayerPostures() {
  const postures = [
    { name: "Kneeling",     desc: "The classic posture of humility and submission. Used in scripture for urgent petition, confession, and worship. It communicates to the body what the soul is trying to express: I am not in charge." },
    { name: "Standing",     desc: "The resurrection posture. The early church stood to pray on Sundays as a proclamation of the resurrection. Standing in prayer is an act of confidence — approaching God not as a cringing subject but as a beloved child." },
    { name: "Prostrate",    desc: "Face to the ground. The most extreme posture of surrender and awe, used in scripture at moments of overwhelming encounter with God. Moses, Joshua, Ezekiel, John. This posture is for the moments when words are not sufficient." },
    { name: "Hands raised", desc: "\"Lifting holy hands\" (1 Timothy 2:8) as an expression of openness, receptivity, and surrender. The physical act of opening the hands and lifting them changes something in the body's relationship to what is being prayed." },
    { name: "Walking",      desc: "Much of Jesus' prayer and conversation with the Father happened in movement. Walking prayer keeps the body engaged and can release thoughts and words that sitting prayer doesn't. Many find that movement unlocks honesty." },
  ];
  const [active, setActive] = useState(0);
  const cur = postures[active];
  return (
    <div style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "24px", overflow: "hidden" }}>
      <div style={{ display: "flex", overflowX: "auto", borderBottom: "1px solid rgba(255,255,255,0.06)", scrollbarWidth: "none" }}>
        {postures.map((p, i) => (<button key={i} onClick={() => setActive(i)} style={{ flexShrink: 0, padding: "14px 18px", border: "none", background: active === i ? "rgba(201,168,76,0.1)" : "transparent", borderBottom: active === i ? "2px solid #C9A84C" : "2px solid transparent", cursor: "pointer", fontFamily: "'Barlow Condensed',sans-serif", fontSize: "9px", letterSpacing: ".2em", textTransform: "uppercase", whiteSpace: "nowrap", color: active === i ? "#C9A84C" : "rgba(250,248,245,0.3)", transition: "all .2s" }}>{p.name}</button>))}
      </div>
      <div style={{ padding: "2.5rem 2rem" }}>
        <p style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: "24px", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".1em", color: "#FAF8F5", marginBottom: "1.25rem" }}>{cur.name}</p>
        <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "18px", lineHeight: 1.82, color: "rgba(250,248,245,0.7)" }}>{cur.desc}</p>
      </div>
    </div>
  );
}

/* ─── INTERACTIVE: SABBATH IDEAS (Sabbath) ───────────────────────── */

function SabbathIdeas() {
  const categories = [
    { label: "Rest",    ideas: ["Sleep in without guilt","Take a long nap in the afternoon","Lie in the grass and watch the sky","Turn off all notifications","Let the day be slow","Do nothing on purpose"] },
    { label: "Delight", ideas: ["Cook a meal you love","Take a long walk with no destination","Read a novel, not a growth book","Play with your kids","Tend a garden","Sit by water","Make something with your hands","Listen to music you love all the way through","Watch the sunset"] },
    { label: "Worship", ideas: ["Gather with your church","Sing — alone or together","Read a Psalm aloud","Take communion at home","Light candles and begin with prayer","Journal gratitude from the week","Pray the Lord's Prayer slowly"] },
    { label: "People",  ideas: ["Share a long, unhurried meal","Have people over with no agenda","Call someone you love","Visit someone who is lonely","Put the phones away at the table","Play a game together"] },
    { label: "Nature",  ideas: ["Hike somewhere beautiful","Swim in open water","Sit outside in the morning quiet","Watch birds","Walk barefoot","Find a place with no artificial noise"] },
    { label: "Rituals", ideas: ["Light two candles to begin","Pour wine or sparkling juice","Begin with a table blessing","End with evening prayer","Keep the same start time each week","Prepare the day before — clear the decks"] },
  ];
  const [active, setActive] = useState(0);
  const cur = categories[active];
  return (
    <div style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "24px", overflow: "hidden" }}>
      <div style={{ display: "flex", flexWrap: "wrap", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        {categories.map((c, i) => (<button key={i} onClick={() => setActive(i)} style={{ padding: "12px 16px", border: "none", background: active === i ? "rgba(201,168,76,0.1)" : "transparent", borderBottom: active === i ? "2px solid #C9A84C" : "2px solid transparent", cursor: "pointer", fontFamily: "'Barlow Condensed',sans-serif", fontSize: "9px", letterSpacing: ".22em", textTransform: "uppercase", color: active === i ? "#C9A84C" : "rgba(250,248,245,0.3)", transition: "all .2s" }}>{c.label}</button>))}
      </div>
      <div style={{ padding: "2rem" }}>
        <p style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: "9px", letterSpacing: ".38em", textTransform: "uppercase", color: "rgba(201,168,76,0.55)", marginBottom: "1.25rem" }}>{cur.label} · Sabbath Ideas</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(180px, 100%), 1fr))", gap: "8px" }}>
          {cur.ideas.map((idea, i) => (<div key={i} style={{ padding: "12px 16px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", fontFamily: "'Cormorant Garamond',serif", fontSize: "16px", color: "rgba(250,248,245,0.72)", lineHeight: 1.4 }}>{idea}</div>))}
        </div>
        <p style={{ marginTop: "1.5rem", fontFamily: "'Barlow Condensed',sans-serif", fontSize: "9px", letterSpacing: ".2em", textTransform: "uppercase", color: "rgba(250,248,245,0.2)" }}>Ask: is this restful or worshipful? If not, it can wait. — John Mark Comer</p>
      </div>
    </div>
  );
}

/* ─── INTERACTIVE: COMMUNITY DEPTHS (Community) ──────────────────── */

function CommunityDepths() {
  const levels = [
    { level: "01", label: "Acquaintance",  desc: "You know their name and face. Surface exchanges. This is the baseline — it is not community.", pct: 100 },
    { level: "02", label: "Familiarity",   desc: "You know their story at a high level. Comfortable conversation. Most people live here.", pct: 78 },
    { level: "03", label: "Friendship",    desc: "Shared experience and genuine care. You would notice if they disappeared. Deeper but often still guarded.", pct: 56 },
    { level: "04", label: "Vulnerability", desc: "They know your real struggles, fears, and failures. You have been honest and received grace. This is where formation begins.", pct: 36 },
    { level: "05", label: "Koinonia",      desc: "Shared life, shared formation, genuine accountability. This is the New Testament vision — rare, costly, and profoundly transforming.", pct: 18 },
  ];
  return (
    <div style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "24px", padding: "2.5rem 2rem" }}>
      <p style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: "9px", letterSpacing: ".42em", textTransform: "uppercase", color: "rgba(201,168,76,0.65)", marginBottom: "2rem" }}>The Depths of Community</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {levels.map((l, i) => (
          <div key={i}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
              <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: "10px", letterSpacing: ".25em", textTransform: "uppercase", color: i === 4 ? "#C9A84C" : "rgba(250,248,245,0.55)", fontWeight: i === 4 ? 700 : 400 }}>{l.label}</span>
              <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: "8px", letterSpacing: ".2em", color: "rgba(250,248,245,0.2)" }}>{l.level}</span>
            </div>
            <div style={{ height: "4px", background: "rgba(255,255,255,0.06)", borderRadius: "2px", overflow: "hidden", marginBottom: "5px" }}>
              <div style={{ height: "100%", width: `${l.pct}%`, background: i === 4 ? "#C9A84C" : `rgba(201,168,76,${0.15 + i * 0.1})`, borderRadius: "2px" }} />
            </div>
            <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "15px", color: "rgba(250,248,245,0.42)", lineHeight: 1.5 }}>{l.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── INTERACTIVES MAP ────────────────────────────────────────────── */

const INTERACTIVES = {
  presence:  ExamenWalkthrough,   // Daily Examen
  scripture: LectioDivinaGuide,   // Lectio Divina
  prayer:    PrayerPostures,       // Prayer Postures
  sabbath:   SabbathIdeas,         // Sabbath Ideas
  community: CommunityDepths,      // Depths of Community
};

/* ─── GO DEEPER — TABBED BOOKS / MEDIA ───────────────────────────── */

function GoDeeperSection({ data, rhythm }) {
  const [tab, setTab] = useState("books");
  const TYPE_COLORS = { Video: "#C9A84C", Podcast: "#8FAF8A", Article: "#A08CC8", Course: "#C87C5A" };

  return (
    <div className="rl-further rl-section">
      <div className="rl-sec-label" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "none", paddingBottom: 0, marginBottom: "1.25rem" }}>
        <span style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: ".75rem", display: "block", width: "100%", letterSpacing: ".5em", fontSize: "9px" }}>Go Deeper</span>
      </div>
      <div style={{ display: "flex", gap: "4px", padding: "4px", background: "rgba(255,255,255,0.04)", borderRadius: "999px", marginBottom: "1.5rem", gridColumn: "1 / -1", width: "fit-content" }}>
        {["books", "media"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: "8px 24px", borderRadius: "999px", border: "none", background: tab === t ? "rgba(201,168,76,0.15)" : "transparent", color: tab === t ? "#C9A84C" : "rgba(250,248,245,0.35)", fontFamily: "'Barlow Condensed',sans-serif", fontSize: "9px", letterSpacing: ".28em", textTransform: "uppercase", cursor: "pointer", fontWeight: tab === t ? 700 : 400, transition: "all .2s" }}>
            {t === "books" ? "Books" : "Media"}
          </button>
        ))}
      </div>
      {tab === "books" && data.further.map((b, i) => (
        <Link key={i} to={`${RULE_BASE}/${rhythm}/book/${i}`} className="rl-book">
          <img src={b.cover} alt={b.title} className="rl-book-img" onError={e => { e.target.style.background = "#17140F"; e.target.style.opacity = "0.4"; }} />
          <div className="rl-book-body">
            <div>
              <p className="rl-book-title">{b.title}</p>
              <p className="rl-book-author">{b.author}</p>
              <p className="rl-book-desc">{b.desc}</p>
            </div>
            <span className="rl-book-cta">Why we recommend it <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1 5h8M5.5 2l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg></span>
          </div>
        </Link>
      ))}
      {tab === "media" && data.media.map((m, i) => (
        <a key={i} href={m.url} target="_blank" rel="noopener noreferrer" className="rl-book" style={{ textDecoration: "none" }}>
          <div style={{ position: "relative", overflow: "hidden", flexShrink: 0 }}>
            <img src={m.thumb} alt={m.title} className="rl-book-img" onError={e => { e.target.style.background = "#17140F"; e.target.style.opacity = "0.4"; }} />
            <div style={{ position: "absolute", top: "8px", left: "8px", padding: "3px 8px", borderRadius: "999px", background: "rgba(6,5,10,0.75)", backdropFilter: "blur(8px)", fontFamily: "'Barlow Condensed',sans-serif", fontSize: "7px", letterSpacing: ".22em", textTransform: "uppercase", color: TYPE_COLORS[m.type] || "#C9A84C", border: `1px solid ${TYPE_COLORS[m.type] || "#C9A84C"}44` }}>{m.type}</div>
          </div>
          <div className="rl-book-body">
            <div>
              <p className="rl-book-title">{m.title}</p>
              <p className="rl-book-author">{m.source}</p>
            </div>
            <span className="rl-book-cta">Watch / Listen <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1 5h8M5.5 2l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg></span>
          </div>
        </a>
      ))}
    </div>
  );
}

/* ─── BOOK PAGE ───────────────────────────────────────────────────── */

export function BookPage() {
  const { rhythm, bookIndex } = useParams();
  const navigate = useNavigate();
  const data   = RHYTHMS.find(r => r.slug === rhythm);
  const book   = data?.further[parseInt(bookIndex, 10)];
  const author = book ? AUTHORS[book.author] : null;
  const coverUrl = book?.cover || null;

  useEffect(() => {
    if (!data || !book) navigate(`${RULE_BASE}/${rhythm}`, { replace: true });
    window.scrollTo(0, 0);
  }, [data, book]);

  if (!data || !book) return null;

  const S = {
    wrap:      { background: "#0E0C0A", minHeight: "100svh", fontFamily: "'Barlow Condensed',sans-serif", color: "#FAF8F5" },
    shell:     { maxWidth: "720px", margin: "0 auto", padding: "100px 24px 100px" },
    back:      { display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "9px", letterSpacing: ".3em", textTransform: "uppercase", color: "rgba(201,168,76,0.7)", textDecoration: "none", marginBottom: "2.5rem" },
    hero:      { display: "grid", gridTemplateColumns: "180px 1fr", gap: "0", alignItems: "stretch", marginBottom: "2.75rem", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "22px", overflow: "hidden" },
    coverWrap: { position: "relative", background: "#17140F", minHeight: "260px", display: "flex", alignItems: "stretch" },
    cover:     { width: "100%", height: "100%", objectFit: "cover", display: "block", minHeight: "260px" },
    coverFallback: { width: "100%", minHeight: "260px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "1.5rem", background: "linear-gradient(135deg,#1C1914,#0E0C0A)", textAlign: "center" },
    heroText:  { padding: "2rem 2rem 2rem 1.75rem", display: "flex", flexDirection: "column", justifyContent: "flex-end" },
    kicker:    { fontSize: "8px", letterSpacing: ".42em", textTransform: "uppercase", color: "rgba(201,168,76,0.65)", marginBottom: ".75rem" },
    title:     { fontFamily: "'Barlow Condensed',sans-serif", fontSize: "clamp(20px,3.5vw,30px)", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "#FAF8F5", lineHeight: .92, marginBottom: "1.25rem" },
    authorRow: { display: "flex", alignItems: "center", gap: "10px" },
    authorPhoto: { width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover", border: "1px solid rgba(201,168,76,0.3)", flexShrink: 0 },
    authorName:  { fontSize: "10px", letterSpacing: ".22em", textTransform: "uppercase", color: "rgba(201,168,76,0.8)", fontWeight: 700 },
    whyLabel:  { fontSize: "9px", letterSpacing: ".42em", textTransform: "uppercase", color: "#C9A84C", marginBottom: "1.1rem", paddingBottom: ".7rem", borderBottom: "1px solid rgba(255,255,255,0.06)" },
    desc:      { fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(17px,3.5vw,20px)", lineHeight: 1.86, color: "rgba(250,248,245,0.76)", marginBottom: "2.5rem" },
    bioWrap:   { background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "1.4rem 1.5rem", marginBottom: "2rem", display: "flex", alignItems: "flex-start", gap: "14px" },
    bioPhoto:  { width: "52px", height: "52px", borderRadius: "50%", objectFit: "cover", border: "1px solid rgba(201,168,76,0.25)", flexShrink: 0 },
    bioName:   { fontSize: "10px", letterSpacing: ".22em", textTransform: "uppercase", color: "rgba(201,168,76,0.75)", fontWeight: 700, marginBottom: ".4rem" },
    bioPara:   { fontFamily: "'Cormorant Garamond',serif", fontSize: "15px", lineHeight: 1.72, color: "rgba(250,248,245,0.5)" },
    cta:       { display: "inline-flex", alignItems: "center", gap: "10px", padding: "15px 28px", borderRadius: "12px", border: "2px solid #C9A84C", background: "#C9A84C", textDecoration: "none", fontFamily: "'Barlow Condensed',sans-serif", fontSize: "10px", letterSpacing: ".28em", textTransform: "uppercase", color: "#0A0A0A", fontWeight: 700, transition: "all .25s" },
    backBtn:   { display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginTop: "1.25rem", padding: "16px", borderRadius: "14px", border: "none", background: "#E8E4DC", textDecoration: "none", fontFamily: "'Barlow Condensed',sans-serif", fontSize: "10px", letterSpacing: ".22em", textTransform: "uppercase", color: "#0A0A0A", fontWeight: 700, transition: "all .25s" },
  };

  return (
    <div style={S.wrap}>
      <Link to="/" style={{ position: "fixed", top: "1rem", left: "50%", transform: "translateX(-50%)", zIndex: 200, display: "flex", alignItems: "center", gap: "10px", padding: "10px 20px 10px 14px", borderRadius: "999px", background: "rgba(14,12,10,0.88)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.08)", textDecoration: "none" }}>
        <img src="/helmet.png" onError={e => { e.target.style.display = "none"; }} alt="" style={{ width: "28px", height: "28px", objectFit: "contain", filter: "brightness(0) invert(1)" }} />
        <span style={{ fontSize: "9px", letterSpacing: ".28em", textTransform: "uppercase", color: "rgba(250,248,245,0.55)", fontWeight: 600 }}>Counter Formation</span>
      </Link>
      <div style={S.shell}>
        <Link to={`${RULE_BASE}/${rhythm}`} style={S.back}>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M12 6.5H1M6 2.5l-4 4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          Back to {data.title}
        </Link>
        <div style={S.hero}>
          <div style={S.coverWrap}>
            {coverUrl && (<img src={coverUrl} alt={book.title} style={S.cover} onError={e => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }} />)}
            <div style={{ ...S.coverFallback, display: coverUrl ? "none" : "flex" }}>
              <p style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em", color: "#FAF8F5", lineHeight: 1.2, marginBottom: ".75rem" }}>{book.title}</p>
              <p style={{ fontSize: "9px", letterSpacing: ".25em", textTransform: "uppercase", color: "rgba(201,168,76,0.6)" }}>{book.author}</p>
            </div>
          </div>
          <div style={S.heroText}>
            <p style={S.kicker}>Recommended Reading</p>
            <h1 style={S.title}>{book.title}</h1>
            <div style={S.authorRow}>
              {author?.photo && (<img src={author.photo} alt={book.author} style={S.authorPhoto} onError={e => { e.target.style.display = "none"; }} />)}
              <span style={S.authorName}>{book.author}</span>
            </div>
          </div>
        </div>
        <p style={S.whyLabel}>Why We Recommend It</p>
        <p style={S.desc}>{book.desc}</p>
        {author?.bio && (
          <div style={S.bioWrap}>
            {author.photo && (<img src={author.photo} alt={book.author} style={S.bioPhoto} onError={e => { e.target.style.display = "none"; }} />)}
            <div><p style={S.bioName}>{book.author}</p><p style={S.bioPara}>{author.bio}</p></div>
          </div>
        )}
        <a href={book.amazon} target="_blank" rel="noopener noreferrer" style={S.cta}
          onMouseEnter={e => { e.currentTarget.style.background = "#FAF8F5"; e.currentTarget.style.borderColor = "#FAF8F5"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "#C9A84C"; e.currentTarget.style.borderColor = "#C9A84C"; }}>
          Purchase on Amazon
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6h8M6.5 2.5l3.5 3.5-3.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
        </a>
        <Link to={`${RULE_BASE}/${rhythm}`} style={S.backBtn}
          onMouseEnter={e => { e.currentTarget.style.background = "#FAF8F5"; e.currentTarget.style.color = "#0A0A0A"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "#E8E4DC"; e.currentTarget.style.color = "#0A0A0A"; }}>
          ← Return to {data.title}
        </Link>
      </div>
    </div>
  );
}

/* ─── SHARED STYLES ───────────────────────────────────────────────── */

export function RuleStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&display=swap');

      .rl-wrap * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
      .rl-wrap   { font-family: 'Barlow Condensed',sans-serif; background: #0E0C0A; color: #FAF8F5; min-height: 100svh; overflow-x: hidden; }

      .rl-shield-mark { position: fixed; top: 1.25rem; left: 1.5rem; z-index: 200; width: 192px; height: 192px; opacity: 0.32; pointer-events: none; }
      @media (max-width: 640px) { .rl-shield-mark { width: 100px; height: 100px; top: 0.5rem; left: 0.5rem; } }

      .rl-prog-bar  { position: sticky; top: 0; z-index: 190; height: 2px; background: rgba(255,255,255,0.05); }
      .rl-prog-fill { height: 100%; width: 0; background: linear-gradient(to right, #C9A84C, rgba(201,168,76,0.35)); transition: width .12s linear; }

      .rl-hero-band { position: relative; overflow: hidden; min-height: clamp(520px,72vw,820px); display: flex; flex-direction: column; justify-content: flex-end; }
      .rl-hero-bg   { position: absolute; inset: 0; background-size: cover; background-position: center center; filter: grayscale(.15); }
      .rl-hero-ov   { position: absolute; inset: 0; background: linear-gradient(to top, rgba(14,12,10,0.96) 0%, rgba(14,12,10,0.35) 45%, rgba(14,12,10,0.08) 100%); }
      .rl-hero-in   { position: relative; z-index: 2; padding: 2rem 24px 2.5rem; max-width: 860px; margin: 0 auto; width: 100%; }
      .rl-hero-logo { width: 32px; height: 32px; filter: invert(1) brightness(.9); opacity: .45; margin-bottom: .9rem; display: block; }
      .rl-hero-eye  { font-size: 9px; letter-spacing: .42em; text-transform: uppercase; color: rgba(201,168,76,0.75); margin-bottom: .5rem; }
      .rl-hero-h1   { font-size: clamp(44px,10vw,88px); font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: #FAF8F5; line-height: .86; margin-bottom: 1rem; }
      .rl-hero-sub  { font-family: 'Cormorant Garamond',serif; font-style: italic; font-size: clamp(16px,3.5vw,22px); color: rgba(250,248,245,0.35); }

      .rl-pullquote      { border-left: 2px solid #C9A84C; margin: 3rem 0; padding: 1.25rem 2rem; background: rgba(201,168,76,0.04); border-radius: 0 12px 12px 0; }
      .rl-pullquote p    { font-family: 'Cormorant Garamond',serif; font-style: italic; font-size: clamp(20px,4.5vw,28px); color: rgba(250,248,245,0.82); line-height: 1.55; margin-bottom: .75rem; }
      .rl-pullquote cite { font-size: 9px; letter-spacing: .32em; text-transform: uppercase; color: #C9A84C; font-style: normal; }

      .rl-content { max-width: 740px; margin: 0 auto; padding: 52px 24px 120px; }
      .rl-sidebar { margin-bottom: 3rem; }

      .rl-rule      { height: 1px; background: linear-gradient(to right, #C9A84C, transparent); opacity: .25; margin: 2.5rem 0; }
      .rl-section   { margin-bottom: 3rem; }
      .rl-sec-label { font-size: 9px; letter-spacing: .42em; text-transform: uppercase; color: #C9A84C; margin-bottom: 1.25rem; padding-bottom: .75rem; border-bottom: 1px solid rgba(255,255,255,0.06); }
      .rl-body      { font-family: 'Cormorant Garamond',serif; font-size: clamp(17px,4vw,20px); line-height: 1.86; color: rgba(250,248,245,0.76); }
      .rl-body p    { margin-bottom: 1.25rem; }
      .rl-body em   { font-style: italic; color: rgba(250,248,245,0.95); }

      .rl-scripture      { background: rgba(255,255,255,0.03); border-left: 2px solid #C9A84C; border-radius: 0 12px 12px 0; padding: 1.4rem 1.5rem; margin: 1.25rem 0; }
      .rl-scripture p    { font-family: 'Cormorant Garamond',serif; font-style: italic; font-size: clamp(15px,3.8vw,18px); color: rgba(250,248,245,0.72); line-height: 1.7; margin-bottom: .6rem; }
      .rl-scripture cite { font-size: 9px; letter-spacing: .32em; text-transform: uppercase; color: #C9A84C; font-style: normal; }

      .rl-steps      { display: flex; flex-direction: column; gap: 1.5rem; }
      .rl-step       { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; padding: 1.5rem; transition: border-color .3s; }
      .rl-step:hover { border-color: rgba(201,168,76,0.25); }
      .rl-step-head  { display: flex; align-items: baseline; gap: 14px; margin-bottom: .9rem; }
      .rl-step-num   { font-size: 10px; letter-spacing: .32em; text-transform: uppercase; color: rgba(201,168,76,0.55); flex-shrink: 0; }
      .rl-step-title { font-size: clamp(16px,3.5vw,20px); font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: #FAF8F5; }
      .rl-step-body  { font-family: 'Cormorant Garamond',serif; font-size: clamp(15px,3.5vw,17px); line-height: 1.82; color: rgba(250,248,245,0.65); }

      .rl-reflections { display: flex; flex-direction: column; gap: 1rem; }
      .rl-reflect-q   { background: rgba(201,168,76,0.04); border: 1px solid rgba(201,168,76,0.14); border-radius: 14px; padding: 1.25rem 1.5rem; font-family: 'Cormorant Garamond',serif; font-style: italic; font-size: clamp(15px,3.5vw,18px); color: rgba(250,248,245,0.65); line-height: 1.7; }

      .rl-further      { display: flex; flex-direction: column; gap: 12px; }
      .rl-book         { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 18px; overflow: hidden; transition: border-color .3s, transform .3s; text-decoration: none; display: grid; grid-template-columns: 120px 1fr; cursor: pointer; align-items: stretch; }
      .rl-book:hover   { border-color: rgba(201,168,76,0.45); transform: translateX(4px); }
      .rl-book-img     { width: 100%; height: 100%; min-height: 130px; object-fit: cover; display: block; filter: grayscale(.35); opacity: .8; transition: opacity .4s, filter .4s; align-self: stretch; }
      .rl-book:hover .rl-book-img { opacity: 1; filter: grayscale(0); }
      .rl-book-body    { padding: 1rem 1.25rem; display: flex; flex-direction: column; justify-content: space-between; min-height: 130px; }
      .rl-book-title   { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: #FAF8F5; margin-bottom: .25rem; line-height: 1.2; }
      .rl-book-author  { font-size: 9px; letter-spacing: .25em; text-transform: uppercase; color: rgba(201,168,76,0.65); margin-bottom: .5rem; }
      .rl-book-desc    { font-family: 'Cormorant Garamond',serif; font-size: 13px; line-height: 1.6; color: rgba(250,248,245,0.45); margin-bottom: .75rem; flex: 1; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
      .rl-book-cta     { display: inline-flex; align-items: center; gap: 6px; font-size: 8px; letter-spacing: .28em; text-transform: uppercase; color: rgba(201,168,76,0.7); transition: color .2s; flex-shrink: 0; }
      .rl-book:hover .rl-book-cta { color: #C9A84C; }

      .rl-rhythm-nav { display: flex; gap: 12px; margin-top: 3rem; }
      .rl-nav-btn { flex: 1; padding: 16px 24px; border-radius: 999px; border: 1px solid rgba(255,255,255,0.10); background: rgba(255,255,255,0.04); text-decoration: none; display: flex; flex-direction: column; gap: 4px; transition: border-color .25s, background .25s; }
      .rl-nav-btn:hover { border-color: rgba(201,168,76,0.45); background: rgba(201,168,76,0.06); }
      .rl-nav-btn-dir   { font-size: 8px; letter-spacing: .38em; text-transform: uppercase; color: rgba(201,168,76,0.65); }
      .rl-nav-btn-title { font-size: clamp(14px,2vw,18px); font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: #FAF8F5; line-height: 1; }
      .rl-nav-btn.next  { text-align: right; align-items: flex-end; }


      @media (min-width: 1024px) {
        .rl-hero-band { min-height: clamp(600px, 78vw, 900px); }
        .rl-hero-in   { max-width: 1100px; padding: 2.5rem 48px 3rem; }
        .rl-hero-h1   { font-size: clamp(60px, 9vw, 108px); }
        .rl-content {
          max-width: 1100px; padding: 60px 48px 140px;
          display: grid; grid-template-columns: 1fr 340px;
          column-gap: 64px; align-items: start;
          grid-template-areas:
            "pullquote   pullquote"
            "why-label   why-label"
            "why-body    sidebar"
            "theology    sidebar"
            "rule1       rule1"
            "interactive interactive"
            "rule2       rule2"
            "practice    practice"
            "further     further"
            "brand       brand"
            "nav         nav";
        }
        .rl-pullquote  { grid-area: pullquote; }
        .rl-why-label  { grid-area: why-label; }
        .rl-why-body   { grid-area: why-body; }
        .rl-sidebar    { grid-area: sidebar; position: sticky; top: 72px; margin-bottom: 0; align-self: start; border-left: 1px solid rgba(255,255,255,0.07); padding-left: 40px; display: flex; flex-direction: column; gap: 2rem; }
        .rl-sidebar .rl-section { margin-bottom: 0; }
        .rl-theology   { grid-area: theology; }
        .rl-rule:nth-of-type(1) { grid-area: rule1; }
        .rl-rule:nth-of-type(2) { grid-area: rule2; }
        .rl-interactive { grid-area: interactive; }
        .rl-practice    { grid-area: practice; }
        .rl-further     { grid-area: further; display: grid; grid-template-columns: 1fr 1fr; gap: 12px; align-items: stretch; grid-auto-flow: row dense; }
        .rl-further .rl-sec-label { grid-column: 1 / -1; }
        .rl-further > div[style*="fit-content"] { grid-column: 1 / -1; }
        .rl-further .rl-book:last-child:nth-child(odd) { grid-column: 1 / -1; }
        .rl-further .rl-book:last-child:nth-child(even) { grid-column: auto; }
        .rl-rhythm-nav  { grid-area: nav; }
        .rl-pullquote p { font-size: clamp(22px, 2.8vw, 32px); }
        .rl-sec-label   { letter-spacing: .5em; }
      }

      @media (min-width: 1440px) {
        .rl-hero-in { max-width: 1320px; padding: 3rem 64px 3.5rem; }
        .rl-content { max-width: 1320px; grid-template-columns: 1fr 380px; column-gap: 80px; padding: 72px 64px 160px; }
        .rl-sidebar { padding-left: 52px; }
      }

      @media (max-width: 767px) {
        .rl-sec-label { font-size: 10px; letter-spacing: .3em; }
        .rl-book-title { font-size: 15px; }
        .rl-book-author { font-size: 11px; }
        .rl-book-cta { font-size: 10px; }
        .rl-nav-btn-dir { font-size: 10px; }
        .rl-examen-tab { font-size: 10px !important; }
      }
    `}</style>
  );
}

/* ─── CORNER NAV ──────────────────────────────────────────────────── */

function CornerNav() {
  return (
    <>
      <img
        src="/shield-white.png"
        className="rl-shield-mark"
        onError={e => { e.target.style.display = "none"; }}
        alt=""
      />
    </>
  );
}

/* ─── RHYTHM PAGE ─────────────────────────────────────────────────── */

export function RhythmPage() {
  const { rhythm }  = useParams();
  const navigate    = useNavigate();
  const rfillRef    = useRef(null);
  const data        = RHYTHMS.find(r => r.slug === rhythm);

  useEffect(() => { if (!data) navigate("/", { replace: true }); }, [data, navigate]);
  useEffect(() => { window.scrollTo(0, 0); }, [rhythm]);
  useEffect(() => {
    if (!data) return;
    const onScroll = () => {
      const d = document.documentElement;
      const pct = d.scrollTop / (d.scrollHeight - d.clientHeight) || 0;
      if (rfillRef.current) rfillRef.current.style.width = (pct * 100) + "%";
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [data]);

  if (!data) return null;

  const idx         = RHYTHMS.findIndex(r => r.slug === rhythm);
  const prev        = RHYTHMS[idx - 1];
  const next        = RHYTHMS[idx + 1];
  const Interactive = INTERACTIVES[data.slug];

  return (
    <div className="rl-wrap">
      <CornerNav />
      <div className="rl-prog-bar"><div className="rl-prog-fill" ref={rfillRef} /></div>

      <div className="rl-hero-band">
        <div className="rl-hero-bg" style={{ backgroundImage: `url('${data.img}')` }} />
        <div className="rl-hero-ov" />
        <div className="rl-hero-in">
          <p className="rl-hero-eye">{data.rhythm} · Rule of Life</p>
          <h1 className="rl-hero-h1">{data.title}</h1>
          <p className="rl-hero-sub">{data.sub}</p>
        </div>
      </div>

      <div className="rl-content">
        <div className="rl-pullquote"><p>"{data.quote}"</p><cite>— <ScriptureRef reference={data.quoteRef} text={data.quote} /></cite></div>

        <div className="rl-why-label"><p className="rl-sec-label">Why This Rhythm</p></div>

        <div className="rl-why-body rl-section">
          {data.why.map((p, i) => (<p key={i} className="rl-body" dangerouslySetInnerHTML={{ __html: p }} />))}
        </div>

        <div className="rl-sidebar">
          <div className="rl-section">
            <p className="rl-sec-label">Key Scriptures</p>
            {data.scriptures.map((s, i) => (<div key={i} className="rl-scripture"><p>"{s.t}"</p><cite><ScriptureRef reference={s.r} text={s.t} /></cite></div>))}
          </div>
          <div className="rl-section">
            <p className="rl-sec-label">Reflection</p>
            <div className="rl-reflections">
              {data.reflection.map((q, i) => (<div key={i} className="rl-reflect-q">{q}</div>))}
            </div>
          </div>

          {/* ── Connected Armor Cross-Links ── */}
          {rhythm === "presence" && (
            <div className="rl-section">
              <p className="rl-sec-label">Connected Armor</p>
              <Link to="/identity/belt-of-truth" className="rl-book" style={{ gridTemplateColumns: "1fr", display: "flex", flexDirection: "column" }}>
                <div className="rl-book-body" style={{ minHeight: "auto" }}>
                  <div>
                    <p className="rl-book-author">Connected Armor</p>
                    <p className="rl-book-title">Belt of Truth</p>
                    <p className="rl-book-desc">The foundation everything else attaches to</p>
                  </div>
                  <span className="rl-book-cta">
                    Explore
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M1 5h8M5.5 2l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                    </svg>
                  </span>
                </div>
              </Link>
            </div>
          )}

          {rhythm === "scripture" && (
            <div className="rl-section">
              <p className="rl-sec-label">Connected Armor</p>
              <Link to="/identity/sword-of-the-spirit" className="rl-book" style={{ gridTemplateColumns: "1fr", display: "flex", flexDirection: "column", marginBottom: "0.75rem" }}>
                <div className="rl-book-body" style={{ minHeight: "auto" }}>
                  <div>
                    <p className="rl-book-author">Connected Armor</p>
                    <p className="rl-book-title">Sword of the Spirit</p>
                    <p className="rl-book-desc">The Word is a weapon</p>
                  </div>
                  <span className="rl-book-cta">
                    Explore
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M1 5h8M5.5 2l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                    </svg>
                  </span>
                </div>
              </Link>
              <Link to="/identity/helmet-of-salvation" className="rl-book" style={{ gridTemplateColumns: "1fr", display: "flex", flexDirection: "column" }}>
                <div className="rl-book-body" style={{ minHeight: "auto" }}>
                  <div>
                    <p className="rl-book-author">Connected Armor</p>
                    <p className="rl-book-title">Helmet of Salvation</p>
                    <p className="rl-book-desc">A protected mind</p>
                  </div>
                  <span className="rl-book-cta">
                    Explore
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M1 5h8M5.5 2l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                    </svg>
                  </span>
                </div>
              </Link>
            </div>
          )}

          {rhythm === "sabbath" && (
            <div className="rl-section">
              <p className="rl-sec-label">Connected Armor</p>
              <Link to="/identity/gospel-of-peace" className="rl-book" style={{ gridTemplateColumns: "1fr", display: "flex", flexDirection: "column" }}>
                <div className="rl-book-body" style={{ minHeight: "auto" }}>
                  <div>
                    <p className="rl-book-author">Connected Armor</p>
                    <p className="rl-book-title">Gospel of Peace</p>
                    <p className="rl-book-desc">Ground beneath you</p>
                  </div>
                  <span className="rl-book-cta">
                    Explore
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M1 5h8M5.5 2l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                    </svg>
                  </span>
                </div>
              </Link>
            </div>
          )}

          {rhythm === "community" && (
            <div className="rl-section">
              <p className="rl-sec-label">Connected Armor</p>
              <Link to="/identity/shield-of-faith" className="rl-book" style={{ gridTemplateColumns: "1fr", display: "flex", flexDirection: "column" }}>
                <div className="rl-book-body" style={{ minHeight: "auto" }}>
                  <div>
                    <p className="rl-book-author">Connected Armor</p>
                    <p className="rl-book-title">Shield of Faith</p>
                    <p className="rl-book-desc">Behind what God has said</p>
                  </div>
                  <span className="rl-book-cta">
                    Explore
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M1 5h8M5.5 2l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                    </svg>
                  </span>
                </div>
              </Link>
            </div>
          )}
        </div>

        <div className="rl-theology rl-section">
          {data.theology.map((p, i) => (<p key={i} className="rl-body">{renderHtmlWithScriptureRefs(p)}</p>))}
        </div>

        <div className="rl-rule" />

        <div className="rl-interactive rl-section">
          <p className="rl-sec-label">{data.interactiveLabel}</p>
          <Interactive />
        </div>

        <div className="rl-rule" />

        <div className="rl-practice rl-section">
          <p className="rl-sec-label">The Practice</p>
          <p className="rl-body" style={{ marginBottom: "1.5rem" }}><span dangerouslySetInnerHTML={{ __html: data.practice.intro }} /></p>
          <div className="rl-steps">
            {data.practice.steps.map((s, i) => (
              <div className="rl-step" key={i}>
                <div className="rl-step-head"><span className="rl-step-num">{s.num}</span><span className="rl-step-title">{s.title}</span></div>
                <p className="rl-step-body">{s.body}</p>
              </div>
            ))}
          </div>
        </div>

        <GoDeeperSection data={data} rhythm={rhythm} />

        <div style={{ textAlign: "center", padding: "2rem 0 1rem", borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: "1rem" }}>
          <img src="/helmet.png" onError={e => { e.target.style.display = "none"; }} alt="" style={{ width: "26px", height: "26px", opacity: .2, filter: "invert(1)", margin: "0 auto .75rem", display: "block" }} />
          <p style={{ fontSize: "8px", letterSpacing: ".32em", textTransform: "uppercase", color: "rgba(255,255,255,0.18)" }}>Counter Formation · Formed in Christ · Ephesians 6:10–18</p>
        </div>

        <div className="rl-rhythm-nav">
          {prev ? (
            <Link to={`${RULE_BASE}/${prev.slug}`} className="rl-nav-btn">
              <span className="rl-nav-btn-dir">← {prev.rhythm}</span>
              <span className="rl-nav-btn-title">{prev.title}</span>
            </Link>
          ) : <div />}
          {next ? (
            <Link to={`${RULE_BASE}/${next.slug}`} className="rl-nav-btn next">
              <span className="rl-nav-btn-dir">{next.rhythm} →</span>
              <span className="rl-nav-btn-title">{next.title}</span>
            </Link>
          ) : <div />}
        </div>
      </div>


    </div>
  );
}