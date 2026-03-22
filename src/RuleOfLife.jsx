import React, { useEffect, useRef, useState, useCallback } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

/* ─── CONSTANTS ───────────────────────────────────────────────────── */

export const RULE_BASE = "/rule-of-life";

const C = {
  heroBg: "#06050A",
  darkBg: "#0E0C0A",
  ruleBg: "#17140F",
  gold:   "#C9A84C",
  ivory:  "#FAF8F5",
};

/* ─── RHYTHM DATA ─────────────────────────────────────────────────── */

export const RHYTHMS = [
  {
    slug:    "presence",
    title:   "Presence",
    sub:     "Attention before God",
    rhythm:  "RHYTHM 01",
    accent:  "#C9A84C",
    img:     "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1400&auto=format&fit=crop",
    imgThumb:"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=600&auto=format&fit=crop",
    quote:   "Be still, and know that I am God.",
    quoteRef:"Psalm 46:10",
    interactiveLabel: "Breath Prayer",
    challengeDay: 1,
    challengeTitle: "You Are Being Formed",

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
      "Paul's instruction to \"pray without ceasing\" (1 Thessalonians 5:17) has confused people for centuries. How can anyone pray without stopping? The contemplatives answer: it is not about words, but about orientation. A life perpetually turned toward God, moment by moment, is a life of unceasing prayer. The practice of presence is simply the training that makes that orientation possible.",
    ],

    scriptures: [
      { t: "Be still, and know that I am God.", r: "Psalm 46:10" },
      { t: "Where can I go from your Spirit? Where can I flee from your presence?", r: "Psalm 139:7" },
      { t: "The Lord is near to all who call on him, to all who call on him in truth.", r: "Psalm 145:18" },
    ],

    practice: {
      intro: "The practice of presence is not a technique — it is a posture. But postures require training. Here are three concrete entry points:",
      steps: [
        {
          num: "01",
          title: "Breath Prayer",
          body: "Choose a short phrase — a name of God, a line of scripture, a simple prayer. Inhale slowly and silently speak the first half. Exhale and speak the second. \"Lord Jesus\" (inhale) / \"have mercy\" (exhale). Do this for five minutes. When your attention wanders — and it will — simply return. The returning is not failure. The returning is the practice.",
        },
        {
          num: "02",
          title: "The Daily Examen",
          body: "At the end of each day, take ten minutes to review it in God's presence. Not to evaluate your performance, but to notice where God was present and where you were absent. Ask: Where did I feel most alive? Where did I feel most disconnected? What do I want to bring to God from today? This practice, from the Ignatian tradition, slowly trains the soul to notice God in the texture of ordinary days.",
        },
        {
          num: "03",
          title: "Threshold Prayers",
          body: "Choose two or three thresholds in your day — waking, entering the workplace, sitting down to eat, closing the laptop. At each threshold, pause for thirty seconds. Acknowledge that God is present. Express gratitude or ask for help. This is not a long prayer. It is a brief, repeated act of reorientation that, over months, begins to change the default posture of your inner life.",
        },
      ],
    },

    reflection: [
      "When in your day do you feel most absent — most somewhere else even while your body is present?",
      "What would it mean to practice the presence of God in the most mundane parts of your week — the commute, the kitchen, the waiting room?",
      "Where have you experienced God's presence unexpectedly? What were the conditions that made you available to notice it?",
    ],

    further: [
      { title: "The Practice of the Presence of God", author: "Brother Lawrence" },
      { title: "The Ruthless Elimination of Hurry", author: "John Mark Comer" },
      { title: "Contemplative Prayer", author: "Thomas Merton" },
      { title: "The Way of the Heart", author: "Henri Nouwen" },
    ],
  },

  {
    slug:    "scripture",
    title:   "Scripture",
    sub:     "Truth before noise",
    rhythm:  "RHYTHM 02",
    accent:  "#C9A84C",
    img:     "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1400&auto=format&fit=crop",
    imgThumb:"https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600&auto=format&fit=crop",
    quote:   "Your word is a lamp to my feet and a light to my path.",
    quoteRef:"Psalm 119:105",
    interactiveLabel: "Lectio Divina Guide",
    challengeDay: 2,
    challengeTitle: "Scripture Before the Algorithm",

    why: [
      "Every culture has a story it tells about who we are, what we're for, and what matters. The algorithm tells one story. The news tells another. The market tells a third. These stories form us — not through argument, but through repetition, image, and the subtle pressure of what gets attention.",
      "Scripture tells a different story. And the practice of reading it regularly is not primarily about information acquisition — it is about narrative formation. We are being re-storied. Our imaginations are being reoriented around a different account of reality.",
      "The early church understood this. The Psalms were sung daily. The Torah was read aloud in community. Paul's letters were circulated and read repeatedly. The assumption was not that one hearing would suffice, but that sustained, repeated immersion in the story of God would, over time, produce people whose desires, instincts, and reflexes were shaped by that story.",
      "The problem for most modern Christians is not that they have rejected scripture — it is that scripture has become one input among many rather than the primary narrative frame. We read a verse in the morning and then spend fourteen hours in a different story. The verse becomes a thin layer of veneer over a structure built entirely from elsewhere.",
      "Scripture before screen is not a rule. It is a recognition that what we give our first attention to has disproportionate power over the architecture of our day.",
    ],

    theology: [
      "The Hebrew word for scripture — <em>torah</em> — is often translated \"law\" but its root meaning is closer to \"instruction\" or \"direction.\" It is the word a parent uses to guide a child, the word a teacher uses to form a student. Torah is not primarily a legal code but a way of life given by a loving God to a people he is forming.",
      "Jesus' relationship to scripture is striking. He quotes it when tempted, interprets it in the sermon on the mount, fulfills it in his life and death. And yet he also says, <em>\"You search the Scriptures because you think that in them you have eternal life; and it is they that bear witness about me.\"</em> (John 5:39) Scripture's purpose is not itself — it is to lead to Christ. We read it not to master a text but to encounter a person.",
      "The Reformers spoke of <em>sola scriptura</em> — scripture alone as the ultimate authority. The contemplatives balanced this with <em>lectio divina</em> — sacred reading, in which the text is not analyzed but listened to, waited on, allowed to speak. Both instincts are correct. The word of God is authoritative and it is alive. It must be studied and it must be received.",
    ],

    scriptures: [
      { t: "Your word is a lamp to my feet and a light to my path.", r: "Psalm 119:105" },
      { t: "All Scripture is breathed out by God and profitable for teaching, for reproof, for correction, and for training in righteousness.", r: "2 Timothy 3:16" },
      { t: "The word of God is living and active, sharper than any two-edged sword.", r: "Hebrews 4:12" },
    ],

    practice: {
      intro: "There is a significant difference between reading scripture for information and reading it for formation. Here is a simple framework for the latter:",
      steps: [
        {
          num: "01",
          title: "Lectio Divina",
          body: "Read a short passage slowly — four or five verses. Read it again. On the third reading, pay attention to any word or phrase that seems to catch your attention, that seems to shimmer or press. Sit with that word in silence for several minutes. Don't analyze it. Ask: what is God saying to me through this? Then respond — in prayer, in writing, in silence. This is not a technique for extracting meaning. It is a posture of receptivity.",
        },
        {
          num: "02",
          title: "Scripture Before Screen",
          body: "The first thirty minutes of your morning belong to God, not to the algorithm. This is not a legalistic rule — it is a recognition that what you give your first attention to shapes the posture of the entire day. Before the phone. Before the news. Before email. Open scripture. Even five verses, read slowly and prayerfully, create a different orientation for everything that follows.",
        },
        {
          num: "03",
          title: "Memorization and Meditation",
          body: "The Psalms were memorized. The Torah was rehearsed. The early church committed entire letters to memory. This is not about showing off or checking boxes — it is about internalizing the narrative so it becomes available to you in the moments when you need it most. Choose one verse per month. Write it on a card. Repeat it throughout the day. Let it become part of your interior furniture.",
        },
        {
          num: "04",
          title: "Communal Reading",
          body: "Scripture was never meant to be read in isolation. Read it with someone. Ask them what they notice. Let their reading illuminate yours. The body of Christ is a hermeneutical community — we interpret the text together, and we need each other to see what we cannot see alone.",
        },
      ],
    },

    reflection: [
      "What story are you currently living inside of? What narrative most shapes your sense of what matters, what to fear, what to hope for?",
      "When you read scripture, do you approach it as a text to be mastered or a voice to be heard? What would it look like to shift from one to the other?",
      "Is there a passage of scripture that has genuinely changed you — not just informed you but formed you? What were the conditions that allowed it to do that?",
    ],

    further: [
      { title: "Eat This Book", author: "Eugene Peterson" },
      { title: "Sacred Reading", author: "Michael Casey" },
      { title: "God Has a Name", author: "John Mark Comer" },
      { title: "The Blue Parakeet", author: "Scot McKnight" },
    ],
  },

  {
    slug:    "prayer",
    title:   "Prayer",
    sub:     "Dependence before action",
    rhythm:  "RHYTHM 03",
    accent:  "#C9A84C",
    img:     "https://images.unsplash.com/photo-1473172707857-f9e276582ab6?q=80&w=1400&auto=format&fit=crop",
    imgThumb:"https://images.unsplash.com/photo-1473172707857-f9e276582ab6?q=80&w=600&auto=format&fit=crop",
    quote:   "Very early in the morning, while it was still dark, Jesus got up, left the house and went off to a solitary place, where he prayed.",
    quoteRef:"Mark 1:35",
    interactiveLabel: "Prayer Postures",
    challengeDay: 4,
    challengeTitle: "What You Hold Onto",

    why: [
      "Prayer is the most countercultural thing a person can do in a productivity-obsessed culture. It is an act of deliberate uselessness — stopping what you are doing in order to speak to and listen to a God you cannot see, whose response you cannot control, whose timing is not yours.",
      "And yet Jesus prayed. Constantly. Habitually. Before decisions (Luke 6:12). After ministry (Mark 1:35). In grief (Matthew 26:36). In dependence (John 17). The disciples — watching a man who clearly had access to divine power — did not ask him to teach them to heal or to preach. They asked him to teach them to pray.",
      "The reason is not mysterious. Prayer is the practice of dependence. It is the repeated, embodied acknowledgment that we are not self-sufficient — that we need God not just in crisis but in the ordinary hours of ordinary days. A life built on prayer is a life that has accepted its own creatureliness and found freedom in it.",
      "Most people who say they struggle with prayer are not struggling with the mechanics of prayer. They are struggling with the underlying posture — the acknowledgment that they are not in charge, that outcomes are not in their hands, that asking is not weakness but wisdom.",
      "Prayer does not change God. But it changes us. It repositions us in relation to reality — from the center of our own story to the posture of a creature before a Creator who is good.",
    ],

    theology: [
      "The Lord's Prayer (Matthew 6:9–13) is not a formula but a grammar — a structure that teaches us how to orient ourselves before God. It begins with the Father's name and kingdom before it comes to our needs. This ordering is the whole point. We do not come to God leading with our agenda. We come acknowledging his.",
      "Paul's instruction to \"pray without ceasing\" (1 Thessalonians 5:17) places prayer not as an activity that interrupts life but as the posture that undergirds it. The Desert Fathers spoke of making the entire day a prayer — not by reciting words constantly but by maintaining an interior orientation of dependence and openness toward God.",
      "James 5:16 speaks of \"the prayer of a righteous person\" having great power. The context is striking — it is the prayer of people praying for one another, interceding in community. Much of the prayer tradition in scripture is communal: the Psalms were sung together, Paul's letters are full of reported intercessions for specific churches, the early church gathered specifically for prayer (Acts 2:42). Personal prayer is essential. But it was never meant to exist in isolation from the praying community.",
    ],

    scriptures: [
      { t: "Do not be anxious about anything, but in everything by prayer and supplication with thanksgiving let your requests be made known to God.", r: "Philippians 4:6" },
      { t: "The Spirit helps us in our weakness. For we do not know what to pray for as we ought, but the Spirit himself intercedes for us with groanings too deep for words.", r: "Romans 8:26" },
      { t: "Ask, and it will be given to you; seek, and you will find; knock, and it will be opened to you.", r: "Matthew 7:7" },
    ],

    practice: {
      intro: "Prayer is less a skill to be acquired and more a relationship to be cultivated. These are not techniques — they are invitations into different dimensions of that relationship:",
      steps: [
        {
          num: "01",
          title: "The Daily Office",
          body: "Fixed-hour prayer is one of the oldest disciplines in the Christian tradition — the monastic practice of stopping at set times each day to pray. Morning, midday, evening, night. You do not need to pray at all four. But choosing two fixed times each day and protecting them creates a rhythm of return. The phone goes down. You stop. You pray. Not because you feel like it, but because you have decided that this is what your life is organized around.",
        },
        {
          num: "02",
          title: "The ACTS Structure",
          body: "Adoration — begin by acknowledging who God is, not what you want. Confession — be honest about where you have fallen short or drifted. Thanksgiving — name three specific things from the last 24 hours. Supplication — bring your requests. This structure prevents prayer from becoming exclusively a wish list. It places petition in the context of worship and honesty.",
        },
        {
          num: "03",
          title: "Contemplative Prayer",
          body: "Choose a short phrase — \"Here I am,\" \"Come, Lord Jesus,\" \"Into your hands.\" Sit in silence. When your mind wanders — and it will — return to the phrase. Not as a mantra to achieve altered states, but as a gentle return to intention. This practice, sometimes called Centering Prayer, trains the capacity to be still and to listen, which is perhaps the rarest and most needed form of prayer in the modern world.",
        },
        {
          num: "04",
          title: "Intercessory Prayer",
          body: "Keep a written list of people you are praying for. Not an impossibly long list — five to ten names. Pray through it slowly. Resist the temptation to treat it as a spiritual to-do list. Instead, as you name each person, hold them in God's presence. Ask for their flourishing. Let your love for them be expressed through your requests on their behalf. Intercession is one of the most concrete ways we can love people who are not in the room.",
        },
      ],
    },

    reflection: [
      "What is your actual current relationship with prayer — not what you think it should be, but what it honestly is?",
      "Where do you feel most resistant to prayer? What does that resistance tell you about what you are holding onto?",
      "If prayer genuinely changes the one who prays, what would a person who prays regularly look like? How does that compare to who you are becoming?",
    ],

    further: [
      { title: "Prayer", author: "Philip Yancey" },
      { title: "A Praying Life", author: "Paul Miller" },
      { title: "The Practice of Contemplative Prayer", author: "Thomas Keating" },
      { title: "Too Busy Not to Pray", author: "Bill Hybels" },
    ],
  },

  {
    slug:    "sabbath",
    title:   "Sabbath",
    sub:     "Rest before production",
    rhythm:  "RHYTHM 04",
    accent:  "#C9A84C",
    img:     "https://images.unsplash.com/photo-1519834785169-98be25ec3f84?q=80&w=1400&auto=format&fit=crop",
    imgThumb:"https://images.unsplash.com/photo-1519834785169-98be25ec3f84?q=80&w=600&auto=format&fit=crop",
    quote:   "Remember the Sabbath day by keeping it holy. Six days you shall labor and do all your work, but the seventh day is a sabbath to the Lord your God.",
    quoteRef:"Exodus 20:8–10",
    interactiveLabel: "Weekly Rhythm",
    challengeDay: 7,
    challengeTitle: "Build a Life That Forms You",

    why: [
      "Sabbath is perhaps the most countercultural practice in this guide. In a culture that equates productivity with virtue and busyness with importance, stopping for an entire day is a radical act.",
      "But that is precisely the point. Sabbath is not primarily a wellness practice or a productivity strategy — it is a theological declaration. By stopping, you are saying with your body what you may believe with your mind but struggle to live: God is in charge. The world does not depend on me. I am a creature, not a creator. I can rest because he does not.",
      "The Sabbath commandment is embedded in the story of creation (Genesis 2:1–3) and the story of liberation (Deuteronomy 5:15). God rested after creation — not because he was tired, but as a pattern for his creatures to follow. And the Israelites were commanded to rest as a reminder that they were no longer slaves — slaves do not get a day off. Free people do.",
      "Walter Brueggemann has written that Sabbath is \"the practical gospel alternative to the anxiety of the market.\" The market never stops. The notifications never stop. The economy of more, faster, better never rests. Sabbath is the practiced refusal of that economy for one day a week.",
      "Most people who try to practice Sabbath discover, within a few weeks, that they cannot easily stop. The anxiety of unfinished tasks, the fear of falling behind, the discomfort of being unproductive — these surface quickly. That anxiety is worth sitting with, because it reveals what has actually been forming us.",
    ],

    theology: [
      "The Hebrew word <em>shabbat</em> means to stop, to cease, to rest. God's rest in Genesis 2 is not passive inactivity — it is the enjoyment and blessing of what has been made. Sabbath is the day set apart for delight, for worship, for unhurried presence with God and with people.",
      "Jesus said, <em>\"The Sabbath was made for man, not man for the Sabbath.\"</em> (Mark 2:27) This is not permission to ignore Sabbath — it is a correction of legalism. The Sabbath is a gift, not a burden. When it becomes a burden, we have misunderstood it. The question is not \"What am I not allowed to do?\" but \"What does it look like to genuinely rest, delight, and trust?\"",
      "The New Testament does not prescribe a specific day for Christian Sabbath. The early church moved its primary gathering to Sunday in celebration of the resurrection. But the principle — one day in seven set apart from production and given to rest and worship — remains. The Sabbath is written into the structure of time itself. Ignoring it does not make us more spiritual. It makes us more anxious, more depleted, and ultimately less capable of the love and presence that formation requires.",
    ],

    scriptures: [
      { t: "Remember the Sabbath day by keeping it holy.", r: "Exodus 20:8" },
      { t: "The Sabbath was made for man, not man for the Sabbath.", r: "Mark 2:27" },
      { t: "Come to me, all who labor and are heavy laden, and I will give you rest.", r: "Matthew 11:28" },
    ],

    practice: {
      intro: "Sabbath is not a single practice but a whole-day posture. Here is a framework for beginning:",
      steps: [
        {
          num: "01",
          title: "Choose a Day and Protect It",
          body: "Sabbath requires a decision made in advance and protected with intention. Choose your day. Put it in the calendar. Tell people who need to know. The battle for Sabbath is won or lost before the day arrives — in the decisions you make about what to finish on the day before and what you are willing to leave undone.",
        },
        {
          num: "02",
          title: "Stop Work Completely",
          body: "This means more than not going to the office. It means not checking email. Not returning to the project in your head. Not \"just finishing one thing.\" The test is simple: are you producing anything? If yes, it is not Sabbath. Stop. The anxiety that surfaces when you stop is not a sign that you need to keep working — it is a sign of how much formation work still needs to be done.",
        },
        {
          num: "03",
          title: "Delight Intentionally",
          body: "Sabbath is not passive — it is active enjoyment. Abraham Joshua Heschel called it \"a palace in time.\" Ask yourself: what do I genuinely enjoy that I never have time for? What makes me feel most alive? Do that. Sabbath is the day you remember you are a human being, not a human doing. Plan it with the same intentionality you bring to your work week.",
        },
        {
          num: "04",
          title: "Worship Together",
          body: "Sabbath was designed to be communal. The gathered people of God, worshipping together, is itself a countercultural act — a visible demonstration that our primary identity is not consumers or producers but a people who belong to God. If you are not gathering regularly with a local church, Sabbath practice will always remain incomplete.",
        },
      ],
    },

    reflection: [
      "What happens inside you when you try to stop working? What does that reaction reveal about what is forming you?",
      "What would genuine delight look like for you on a Sabbath? When did you last spend a full day doing what you love, without guilt?",
      "What would you have to believe about God — really believe, not just intellectually affirm — in order to rest fully?",
    ],

    further: [
      { title: "Sabbath", author: "Wayne Muller" },
      { title: "The Sabbath", author: "Abraham Joshua Heschel" },
      { title: "Garden City", author: "John Mark Comer" },
      { title: "Subversive Sabbath", author: "A.J. Swoboda" },
    ],
  },

  {
    slug:    "community",
    title:   "Community",
    sub:     "Formation together",
    rhythm:  "RHYTHM 05",
    accent:  "#C9A84C",
    img:     "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1400&auto=format&fit=crop",
    imgThumb:"https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=600&auto=format&fit=crop",
    quote:   "They devoted themselves to the apostles' teaching and to fellowship, to the breaking of bread and to prayer.",
    quoteRef:"Acts 2:42",
    interactiveLabel: "Depths of Community",
    challengeDay: 6,
    challengeTitle: "You Cannot Do This Alone",

    why: [
      "We live in an era of unprecedented connection and epidemic loneliness. We have more ways to communicate with more people than any generation in history — and research consistently shows that people are more isolated, more unknown, and more alone than ever before.",
      "The church was never meant to be a broadcast medium. It was meant to be a body — an organism in which people are genuinely known, genuinely accountable, and genuinely in one another's lives. Not as a social preference, but as a theological necessity.",
      "The doctrine of the Trinity — Father, Son, and Spirit in eternal, mutual self-giving love — suggests that community is not a human invention but a reflection of God's own inner life. We were made in the image of a God who is inherently relational. Isolation is not neutral — it is a kind of theological malformation.",
      "You cannot become like Jesus alone. This is not a motivational claim — it is an observation about how transformation actually works. Jesus did not mail letters to the twelve. He lived with them. Ate with them. Walked with them for three years. Proximity — genuine, sustained, unhurried proximity — is the environment in which formation happens.",
      "The question is not whether you have community. Everyone has some kind of community. The question is whether your community is oriented around formation. Most communities are oriented around something else — entertainment, shared interests, professional advancement. A formation community is one that has explicitly committed to helping each other become more like Jesus.",
    ],

    theology: [
      "The New Testament's vision of the church is captured in its use of the word <em>ekklesia</em> — the assembled people called out and called together. The letter to the Hebrews warns against \"giving up meeting together\" (10:25) not because gathering is a rule to follow but because it is a necessity of life. A body part that has separated from the body dies.",
      "Paul's metaphor of the body (1 Corinthians 12) makes the interdependence explicit: \"The eye cannot say to the hand, 'I don't need you!'\" Every member is necessary. Every member is vulnerable. The health of the whole depends on the contribution and vulnerability of each part. This is not the vision of a religious social club — it is the vision of a people so deeply committed to one another that their lives are genuinely shared.",
      "The \"one another\" commands of the New Testament are remarkable in their scope: love one another, serve one another, bear one another's burdens, confess your sins to one another, pray for one another, encourage one another, admonish one another. These commands cannot be fulfilled at a distance. They require presence, trust, and a willingness to be known that most of us spend considerable energy avoiding.",
    ],

    scriptures: [
      { t: "They devoted themselves to the apostles' teaching and to fellowship, to the breaking of bread and to prayer.", r: "Acts 2:42" },
      { t: "Bear one another's burdens, and so fulfill the law of Christ.", r: "Galatians 6:2" },
      { t: "And let us consider how to stir up one another to love and good works, not neglecting to meet together.", r: "Hebrews 10:24–25" },
    ],

    practice: {
      intro: "Community is not found — it is built. It requires initiative, vulnerability, and sustained commitment. Here are the foundational practices:",
      steps: [
        {
          num: "01",
          title: "Find a Small Community",
          body: "The Sunday gathering is essential but insufficient. It cannot provide what you actually need, which is to be known. Find or form a group of four to eight people committed to meeting regularly — weekly or biweekly — with an explicit purpose of spiritual formation. Not a Bible study that ends in information. Not a social group that stays at the surface. A community with an agreed commitment to honesty, accountability, and shared formation.",
        },
        {
          num: "02",
          title: "Practice Radical Honesty",
          body: "The deepest barrier to genuine community is not schedule or geography — it is the curated self. Most of us present a version of ourselves carefully edited for public consumption. The practice of radical honesty — sharing not the polished version but the real one — is terrifying and transformative. Start small. Share one real thing. Notice what happens. Community is built on the accumulation of honest moments.",
        },
        {
          num: "03",
          title: "Ask Better Questions",
          body: "\"How are you doing?\" is not a real question. It is a social ritual with a predetermined answer. Practice asking questions that require real answers: What has been hardest for you this week? Where have you felt God's presence? What are you afraid of right now? What have you been avoiding? These questions create space for genuine encounter — which is the material community is made of.",
        },
        {
          num: "04",
          title: "Show Up Consistently",
          body: "Community is built over years, not weeks. The people who know you best are the people who have seen you across multiple seasons of life — in the good years and the hard ones, when you are easy to love and when you are not. This requires the most underrated virtue in community: showing up when you do not feel like it. Commitment that is contingent on how you feel is not commitment — it is preference.",
        },
      ],
    },

    reflection: [
      "Are you currently known — actually known — by anyone? Not known about, but known? If not, what is keeping you from being known?",
      "What would you have to risk in order to move from acquaintance to genuine community with the people in your life?",
      "What kind of community are you helping to create for others? Are you the kind of person who makes it easier or harder for people to be honest?",
    ],

    further: [
      { title: "Life Together", author: "Dietrich Bonhoeffer" },
      { title: "The Deeply Formed Life", author: "Rich Villodas" },
      { title: "The Body", author: "Chuck Colson" },
      { title: "Emotionally Healthy Spirituality", author: "Peter Scazzero" },
    ],
  },
];

/* ─── INTERACTIVE ELEMENTS ────────────────────────────────────────── */

function BreathPrayer() {
  const [phase, setPhase]   = useState("idle"); // idle | inhale | hold | exhale | rest
  const [count, setCount]   = useState(0);
  const [cycles, setCycles] = useState(0);
  const timerRef            = useRef(null);

  const PHASES = [
    { key: "inhale", label: "Inhale",  word: "Lord Jesus",   dur: 4000, next: "hold"   },
    { key: "hold",   label: "Hold",    word: "…",            dur: 1500, next: "exhale" },
    { key: "exhale", label: "Exhale",  word: "have mercy",   dur: 4000, next: "rest"   },
    { key: "rest",   label: "Rest",    word: "…",            dur: 1500, next: "inhale" },
  ];

  const start = () => {
    setPhase("inhale");
    setCount(0);
  };

  const stop = () => {
    clearTimeout(timerRef.current);
    setPhase("idle");
    setCount(0);
  };

  useEffect(() => {
    if (phase === "idle") return;
    const cur = PHASES.find(p => p.key === phase);
    if (!cur) return;
    timerRef.current = setTimeout(() => {
      if (cur.next === "inhale") setCycles(c => c + 1);
      setPhase(cur.next);
    }, cur.dur);
    return () => clearTimeout(timerRef.current);
  }, [phase]);

  const cur = PHASES.find(p => p.key === phase);
  const scale = phase === "inhale" ? 1.35 : phase === "exhale" ? 0.75 : phase === "hold" ? 1.35 : 0.75;
  const phaseLabel = cur ? cur.label : "Begin";
  const phaseWord  = cur ? cur.word  : "";

  return (
    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(201,168,76,0.18)", borderRadius: "20px", padding: "2.5rem 1.5rem", textAlign: "center" }}>
      <p style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: "9px", letterSpacing: ".42em", textTransform: "uppercase", color: "#C9A84C", marginBottom: "1.5rem" }}>Breath Prayer · Lord Jesus, have mercy</p>

      <div style={{ position: "relative", width: "140px", height: "140px", margin: "0 auto 2rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {/* outer ring */}
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "1px solid rgba(201,168,76,0.15)" }} />
        {/* breathing circle */}
        <div style={{
          width: "80px", height: "80px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(201,168,76,0.25), rgba(201,168,76,0.06))",
          border: "1px solid rgba(201,168,76,0.4)",
          transform: `scale(${scale})`,
          transition: phase === "inhale" ? "transform 4s ease-in-out" : phase === "exhale" ? "transform 4s ease-in-out" : "transform 0.3s ease",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic", fontSize: "11px", color: "rgba(250,248,245,0.6)", letterSpacing: ".05em" }}>{phaseWord}</span>
        </div>
      </div>

      <p style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: "11px", letterSpacing: ".3em", textTransform: "uppercase", color: "rgba(250,248,245,0.5)", marginBottom: "1.5rem", minHeight: "20px" }}>
        {phaseLabel}{cycles > 0 ? ` · ${cycles} ${cycles === 1 ? "breath" : "breaths"}` : ""}
      </p>

      {phase === "idle" ? (
        <button onClick={start} style={{ padding: "12px 32px", borderRadius: "999px", border: "1px solid rgba(201,168,76,0.4)", background: "transparent", color: "#C9A84C", fontFamily: "'Barlow Condensed',sans-serif", fontSize: "10px", letterSpacing: ".28em", textTransform: "uppercase", cursor: "pointer" }}>
          Begin
        </button>
      ) : (
        <button onClick={stop} style={{ padding: "12px 32px", borderRadius: "999px", border: "1px solid rgba(255,255,255,0.12)", background: "transparent", color: "rgba(250,248,245,0.4)", fontFamily: "'Barlow Condensed',sans-serif", fontSize: "10px", letterSpacing: ".28em", textTransform: "uppercase", cursor: "pointer" }}>
          Stop
        </button>
      )}
    </div>
  );
}

function LectioDivinaGuide() {
  const steps = [
    { num: "I",   latin: "Lectio",      eng: "Read",       desc: "Read the passage slowly, aloud if possible. Read it again. A third time. You are not looking for information — you are listening for a word or phrase that seems to press against you." },
    { num: "II",  latin: "Meditatio",   eng: "Reflect",    desc: "Take the word or phrase that caught you. Repeat it quietly. Turn it over. Let it interact with your memory, your imagination, your current situation. Don't analyze — ruminate, like an animal chewing cud." },
    { num: "III", latin: "Oratio",      eng: "Respond",    desc: "Let what has arisen in meditation move you to prayer. Speak to God — in gratitude, petition, confession, praise. This is not a structured prayer. It is a spontaneous response to what God has stirred in you." },
    { num: "IV",  latin: "Contemplatio",eng: "Rest",       desc: "Release all thoughts, words, and images. Simply rest in God's presence. You are not trying to achieve anything. You are resting in the love of the One who has spoken. Even five minutes of this silence is more valuable than it seems." },
  ];
  const [active, setActive] = useState(0);
  const cur = steps[active];

  return (
    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(201,168,76,0.18)", borderRadius: "20px", overflow: "hidden" }}>
      <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        {steps.map((s, i) => (
          <button key={i} onClick={() => setActive(i)}
            style={{ flex: 1, padding: "14px 8px", border: "none", background: active === i ? "rgba(201,168,76,0.08)" : "transparent",
              borderBottom: active === i ? "2px solid #C9A84C" : "2px solid transparent",
              cursor: "pointer", fontFamily: "'Barlow Condensed',sans-serif", fontSize: "9px",
              letterSpacing: ".2em", textTransform: "uppercase",
              color: active === i ? "#C9A84C" : "rgba(250,248,245,0.3)", transition: "all .2s" }}>
            {s.latin}
          </button>
        ))}
      </div>
      <div style={{ padding: "2rem" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "1rem" }}>
          <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "28px", color: "rgba(201,168,76,0.5)" }}>{cur.num}</span>
          <div>
            <p style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: "18px", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".1em", color: "#FAF8F5" }}>{cur.eng}</p>
            <p style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: "9px", letterSpacing: ".3em", textTransform: "uppercase", color: "rgba(201,168,76,0.6)" }}>{cur.latin}</p>
          </div>
        </div>
        <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "17px", lineHeight: 1.8, color: "rgba(250,248,245,0.68)" }}>{cur.desc}</p>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1.5rem" }}>
          <button onClick={() => setActive(i => Math.max(0, i - 1))} disabled={active === 0}
            style={{ padding: "8px 20px", borderRadius: "999px", border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "rgba(250,248,245,0.35)", fontFamily: "'Barlow Condensed',sans-serif", fontSize: "9px", letterSpacing: ".2em", textTransform: "uppercase", cursor: active === 0 ? "not-allowed" : "pointer", opacity: active === 0 ? .3 : 1 }}>
            ← Prev
          </button>
          <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: "8px", letterSpacing: ".3em", textTransform: "uppercase", color: "rgba(250,248,245,0.2)", alignSelf: "center" }}>{active + 1} of {steps.length}</span>
          <button onClick={() => setActive(i => Math.min(steps.length - 1, i + 1))} disabled={active === steps.length - 1}
            style={{ padding: "8px 20px", borderRadius: "999px", border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "rgba(250,248,245,0.35)", fontFamily: "'Barlow Condensed',sans-serif", fontSize: "9px", letterSpacing: ".2em", textTransform: "uppercase", cursor: active === steps.length - 1 ? "not-allowed" : "pointer", opacity: active === steps.length - 1 ? .3 : 1 }}>
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}

function PrayerPostures() {
  const postures = [
    { name: "Kneeling",    desc: "The classic posture of humility and submission. Used in scripture for urgent petition, confession, and worship. It communicates to the body what the soul is trying to express: I am not in charge.", icon: "⌇" },
    { name: "Standing",    desc: "The resurrection posture. The early church stood to pray on Sundays as a proclamation of the resurrection. Standing in prayer is an act of confidence — approaching God not as a cringing subject but as a beloved child.", icon: "↑" },
    { name: "Prostrate",   desc: "Face to the ground. The most extreme posture of surrender and awe, used in scripture at moments of overwhelming encounter with God. Moses, Joshua, Ezekiel, John. This posture is for the moments when words are not sufficient.", icon: "—" },
    { name: "Hands raised", desc: "\"Lifting holy hands\" (1 Timothy 2:8) as an expression of openness, receptivity, and surrender. The physical act of opening the hands and lifting them changes something in the body's relationship to what is being prayed.", icon: "↑↑" },
    { name: "Walking",     desc: "Much of Jesus' prayer and conversation with the Father happened in movement — in the garden, on the mountain, in solitary places. Walking prayer keeps the body engaged and can release thoughts and words that sitting prayer doesn't.", icon: "→" },
  ];
  const [active, setActive] = useState(0);
  const cur = postures[active];
  return (
    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(201,168,76,0.18)", borderRadius: "20px", overflow: "hidden" }}>
      <div style={{ display: "flex", overflowX: "auto", borderBottom: "1px solid rgba(255,255,255,0.06)", scrollbarWidth: "none" }}>
        {postures.map((p, i) => (
          <button key={i} onClick={() => setActive(i)}
            style={{ flexShrink: 0, padding: "12px 16px", border: "none", background: active === i ? "rgba(201,168,76,0.08)" : "transparent",
              borderBottom: active === i ? "2px solid #C9A84C" : "2px solid transparent",
              cursor: "pointer", fontFamily: "'Barlow Condensed',sans-serif", fontSize: "9px",
              letterSpacing: ".2em", textTransform: "uppercase", whiteSpace: "nowrap",
              color: active === i ? "#C9A84C" : "rgba(250,248,245,0.3)", transition: "all .2s" }}>
            {p.name}
          </button>
        ))}
      </div>
      <div style={{ padding: "2rem" }}>
        <p style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: "22px", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".1em", color: "#FAF8F5", marginBottom: "1rem" }}>{cur.name}</p>
        <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "17px", lineHeight: 1.8, color: "rgba(250,248,245,0.68)" }}>{cur.desc}</p>
      </div>
    </div>
  );
}

function WeeklyRhythm() {
  const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const [sabbathDay, setSabbathDay] = useState(0);

  return (
    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(201,168,76,0.18)", borderRadius: "20px", padding: "2rem" }}>
      <p style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: "9px", letterSpacing: ".42em", textTransform: "uppercase", color: "#C9A84C", marginBottom: "1.5rem" }}>Your Weekly Pattern</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: "6px", marginBottom: "1.5rem" }}>
        {days.map((d, i) => {
          const isSabbath = i === sabbathDay;
          return (
            <button key={i} onClick={() => setSabbathDay(i)}
              style={{
                padding: "12px 4px", borderRadius: "10px", border: `1px solid ${isSabbath ? "#C9A84C" : "rgba(255,255,255,0.08)"}`,
                background: isSabbath ? "rgba(201,168,76,0.12)" : "rgba(255,255,255,0.03)",
                cursor: "pointer", textAlign: "center",
                boxShadow: isSabbath ? "0 0 16px rgba(201,168,76,0.15)" : "none",
                transition: "all .25s",
              }}>
              <p style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: "9px", letterSpacing: ".2em", textTransform: "uppercase", color: isSabbath ? "#C9A84C" : "rgba(250,248,245,0.3)", marginBottom: "4px" }}>{d}</p>
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: isSabbath ? "#C9A84C" : "rgba(255,255,255,0.12)", margin: "0 auto" }} />
            </button>
          );
        })}
      </div>

      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "1.25rem" }}>
        <p style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: "9px", letterSpacing: ".3em", textTransform: "uppercase", color: "rgba(250,248,245,0.3)", marginBottom: ".5rem" }}>
          Six days for work · <span style={{ color: "#C9A84C" }}>{days[sabbathDay]} set apart</span>
        </p>
        <p style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic", fontSize: "15px", color: "rgba(250,248,245,0.45)", lineHeight: 1.7 }}>
          "The Sabbath is not a date but an atmosphere." — Abraham Joshua Heschel
        </p>
      </div>
    </div>
  );
}

function CommunityDepths() {
  const levels = [
    { level: "01", label: "Acquaintance",  desc: "You know their name and face. Surface exchanges. This is the baseline — it is not community.", width: "100%" },
    { level: "02", label: "Familiarity",   desc: "You know their story at a high level. Comfortable conversation. Most people live here.", width: "82%" },
    { level: "03", label: "Friendship",    desc: "Shared experience and genuine care. You would notice if they disappeared. Deeper but often still guarded.", width: "62%" },
    { level: "04", label: "Vulnerability", desc: "They know your real struggles, fears, and failures. You have been honest and received grace. This is where formation begins.", width: "42%" },
    { level: "05", label: "Koinonia",      desc: "Shared life, shared formation, genuine accountability. This is the New Testament vision — rare, costly, and profoundly transforming.", width: "24%" },
  ];
  return (
    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(201,168,76,0.18)", borderRadius: "20px", padding: "2rem" }}>
      <p style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: "9px", letterSpacing: ".42em", textTransform: "uppercase", color: "#C9A84C", marginBottom: "1.75rem" }}>The Depths of Community</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {levels.map((l, i) => (
          <div key={i}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
              <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: "9px", letterSpacing: ".25em", textTransform: "uppercase", color: i === 4 ? "#C9A84C" : "rgba(250,248,245,0.5)" }}>{l.label}</span>
              <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: "8px", letterSpacing: ".2em", color: "rgba(250,248,245,0.2)" }}>{l.level}</span>
            </div>
            <div style={{ height: "4px", background: "rgba(255,255,255,0.06)", borderRadius: "2px", overflow: "hidden" }}>
              <div style={{ height: "100%", width: l.width, background: i === 4 ? "#C9A84C" : `rgba(201,168,76,${0.15 + i * 0.1})`, borderRadius: "2px", transition: "width .6s ease" }} />
            </div>
            <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "14px", color: "rgba(250,248,245,0.4)", marginTop: "4px", lineHeight: 1.5 }}>{l.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const INTERACTIVES = {
  presence:  BreathPrayer,
  scripture: LectioDivinaGuide,
  prayer:    PrayerPostures,
  sabbath:   WeeklyRhythm,
  community: CommunityDepths,
};

/* ─── SHARED STYLES ───────────────────────────────────────────────── */

export function RuleStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&display=swap');

      .rl-wrap *  { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
      .rl-wrap    { font-family: 'Barlow Condensed',sans-serif; background: #0E0C0A; color: #FAF8F5; min-height: 100svh; overflow-x: hidden; }

      /* Corner nav — same pattern as challenge */
      .rl-corner-nav {
        position: fixed; top: 1rem; left: 50%; transform: translateX(-50%);
        z-index: 200; display: flex; align-items: center; gap: 10px;
        padding: 10px 20px 10px 14px; border-radius: 999px;
        background: rgba(14,12,10,0.88); backdrop-filter: blur(20px);
        border: 1px solid rgba(255,255,255,0.08);
        text-decoration: none; transition: border-color .25s;
      }
      .rl-corner-nav:hover { border-color: rgba(201,168,76,0.35); }
      .rl-corner-nav img   { width: 28px; height: 28px; object-fit: contain; filter: invert(1) brightness(1.1); }
      .rl-corner-nav span  { font-size: 9px; letter-spacing: .28em; text-transform: uppercase; color: rgba(250,248,245,0.55); font-weight: 600; white-space: nowrap; }

      /* Reading progress */
      .rl-prog-bar  { position: sticky; top: 0; z-index: 190; height: 2px; background: rgba(255,255,255,0.05); }
      .rl-prog-fill { height: 100%; width: 0; background: linear-gradient(to right, #C9A84C, rgba(201,168,76,0.35)); transition: width .12s linear; }

      /* Hero image band */
      .rl-hero-band {
        position: relative; overflow: hidden;
        min-height: clamp(300px,52vw,500px);
        display: flex; flex-direction: column; justify-content: flex-end;
      }
      .rl-hero-bg  { position: absolute; inset: 0; background-size: cover; background-position: center; filter: grayscale(.15); }
      .rl-hero-ov  { position: absolute; inset: 0; background: linear-gradient(to top, rgba(14,12,10,0.98) 0%, rgba(14,12,10,0.55) 50%, rgba(14,12,10,0.2) 100%); }
      .rl-hero-in  { position: relative; z-index: 2; padding: 2rem 24px 2.5rem; max-width: 800px; margin: 0 auto; width: 100%; }
      .rl-hero-logo{ width: 32px; height: 32px; filter: invert(1) brightness(.9); opacity: .45; margin-bottom: .9rem; display: block; }
      .rl-hero-eye { font-size: 9px; letter-spacing: .42em; text-transform: uppercase; color: rgba(201,168,76,0.75); margin-bottom: .5rem; }
      .rl-hero-h1  { font-size: clamp(44px,10vw,88px); font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: #FAF8F5; line-height: .86; margin-bottom: 1rem; }
      .rl-hero-sub { font-family: 'Cormorant Garamond',serif; font-style: italic; font-size: clamp(16px,3.5vw,22px); color: rgba(250,248,245,0.35); }

      /* Pull quote */
      .rl-pullquote {
        border-left: 2px solid #C9A84C;
        margin: 3rem 0; padding: 1.25rem 2rem;
        background: rgba(201,168,76,0.04);
        border-radius: 0 12px 12px 0;
      }
      .rl-pullquote p    { font-family: 'Cormorant Garamond',serif; font-style: italic; font-size: clamp(20px,4.5vw,28px); color: rgba(250,248,245,0.82); line-height: 1.55; margin-bottom: .75rem; }
      .rl-pullquote cite { font-size: 9px; letter-spacing: .32em; text-transform: uppercase; color: #C9A84C; font-style: normal; }

      /* Content layout */
      .rl-content   { max-width: 740px; margin: 0 auto; padding: 52px 24px 100px; }
      .rl-rule      { height: 1px; background: linear-gradient(to right, #C9A84C, transparent); opacity: .25; margin: 2.5rem 0; }
      .rl-section   { margin-bottom: 3rem; }
      .rl-sec-label { font-size: 9px; letter-spacing: .42em; text-transform: uppercase; color: #C9A84C; margin-bottom: 1.25rem; padding-bottom: .75rem; border-bottom: 1px solid rgba(255,255,255,0.06); }
      .rl-body      { font-family: 'Cormorant Garamond',serif; font-size: clamp(17px,4vw,20px); line-height: 1.86; color: rgba(250,248,245,0.76); }
      .rl-body p    { margin-bottom: 1.25rem; }
      .rl-body em   { font-style: italic; color: rgba(250,248,245,0.95); }

      /* Scripture blocks */
      .rl-scripture      { background: rgba(255,255,255,0.03); border-left: 2px solid #C9A84C; border-radius: 0 12px 12px 0; padding: 1.4rem 1.5rem; margin: 1.25rem 0; }
      .rl-scripture p    { font-family: 'Cormorant Garamond',serif; font-style: italic; font-size: clamp(15px,3.8vw,18px); color: rgba(250,248,245,0.72); line-height: 1.7; margin-bottom: .6rem; }
      .rl-scripture cite { font-size: 9px; letter-spacing: .32em; text-transform: uppercase; color: #C9A84C; font-style: normal; }

      /* Practice steps */
      .rl-steps       { display: flex; flex-direction: column; gap: 1.5rem; }
      .rl-step        { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; padding: 1.5rem; transition: border-color .3s; }
      .rl-step:hover  { border-color: rgba(201,168,76,0.25); }
      .rl-step-head   { display: flex; align-items: baseline; gap: 14px; margin-bottom: .9rem; }
      .rl-step-num    { font-size: 10px; letter-spacing: .32em; text-transform: uppercase; color: rgba(201,168,76,0.55); flex-shrink: 0; }
      .rl-step-title  { font-size: clamp(16px,3.5vw,20px); font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: #FAF8F5; }
      .rl-step-body   { font-family: 'Cormorant Garamond',serif; font-size: clamp(15px,3.5vw,17px); line-height: 1.82; color: rgba(250,248,245,0.65); }

      /* Reflection */
      .rl-reflections { display: flex; flex-direction: column; gap: 1rem; }
      .rl-reflect-q   { background: rgba(201,168,76,0.04); border: 1px solid rgba(201,168,76,0.14); border-radius: 14px; padding: 1.25rem 1.5rem; font-family: 'Cormorant Garamond',serif; font-style: italic; font-size: clamp(15px,3.5vw,18px); color: rgba(250,248,245,0.65); line-height: 1.7; }

      /* Further reading */
      .rl-further     { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(200px,100%), 1fr)); gap: 10px; }
      .rl-book        { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; padding: 1.1rem 1.25rem; transition: border-color .3s; }
      .rl-book:hover  { border-color: rgba(201,168,76,0.25); }
      .rl-book-title  { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: #FAF8F5; margin-bottom: .3rem; line-height: 1.3; }
      .rl-book-author { font-size: 9px; letter-spacing: .25em; text-transform: uppercase; color: rgba(201,168,76,0.55); }

      /* Interactive label */
      .rl-interactive-label { font-size: 9px; letter-spacing: .42em; text-transform: uppercase; color: #C9A84C; margin-bottom: 1.25rem; padding-bottom: .75rem; border-bottom: 1px solid rgba(255,255,255,0.06); }

      /* Rhythm nav */
      .rl-rhythm-nav  { display: flex; gap: 10px; margin-top: 3rem; }
      .rl-nav-btn     { flex: 1; padding: 15px; border-radius: 14px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.03); cursor: pointer; font-family: 'Barlow Condensed',sans-serif; font-size: 9px; letter-spacing: .18em; text-transform: uppercase; color: rgba(255,255,255,0.38); text-align: center; transition: border-color .25s, color .25s; text-decoration: none; display: block; }
      .rl-nav-btn:hover { border-color: rgba(201,168,76,0.38); color: #C9A84C; }
      .rl-nav-btn span  { display: block; font-size: 7px; opacity: .45; margin-bottom: 3px; }

      /* Challenge cross-link */
      .rl-challenge-link {
        display: flex; align-items: center; justify-content: space-between;
        background: rgba(201,168,76,0.06); border: 1px solid rgba(201,168,76,0.2);
        border-radius: 14px; padding: 1.25rem 1.5rem; text-decoration: none;
        transition: background .25s, border-color .25s; margin-top: 1rem;
      }
      .rl-challenge-link:hover { background: rgba(201,168,76,0.1); border-color: rgba(201,168,76,0.4); }
      .rl-challenge-link-left p:first-child { font-size: 8px; letter-spacing: .35em; text-transform: uppercase; color: rgba(201,168,76,0.6); margin-bottom: .3rem; }
      .rl-challenge-link-left p:last-child  { font-size: clamp(13px,3vw,15px); font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: #FAF8F5; }
      .rl-challenge-arrow { font-size: 18px; color: rgba(201,168,76,0.5); }

      /* Footer */
      .rl-footer     { background: #06050A; border-top: 1px solid rgba(255,255,255,0.05); padding: 28px 1.5rem; text-align: center; }
      .rl-footer img { width: 24px; height: 24px; opacity: .2; filter: invert(1); display: block; margin: 0 auto .75rem; }
      .rl-footer p   { font-size: 8px; letter-spacing: .28em; text-transform: uppercase; color: rgba(255,255,255,0.18); }
    `}</style>
  );
}

/* ─── CORNER NAV ──────────────────────────────────────────────────── */

function CornerNav() {
  return (
    <Link to="/" className="rl-corner-nav">
      <img src="/helmet.png" onError={e => { e.target.style.display = "none"; }} alt="Counter Formation" />
      <span>Counter Formation</span>
    </Link>
  );
}

/* ─── RHYTHM PAGE ─────────────────────────────────────────────────── */

export function RhythmPage() {
  const { rhythm }  = useParams();
  const navigate    = useNavigate();
  const rfillRef    = useRef(null);
  const data        = RHYTHMS.find(r => r.slug === rhythm);

  useEffect(() => {
    if (!data) navigate("/", { replace: true });
  }, [data, navigate]);

  useEffect(() => { window.scrollTo(0, 0); }, [rhythm]);

  useEffect(() => {
    if (!data) return;
    const onScroll = () => {
      const d   = document.documentElement;
      const pct = d.scrollTop / (d.scrollHeight - d.clientHeight) || 0;
      if (rfillRef.current) rfillRef.current.style.width = (pct * 100) + "%";
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [data]);

  if (!data) return null;

  const idx      = RHYTHMS.findIndex(r => r.slug === rhythm);
  const prev     = RHYTHMS[idx - 1];
  const next     = RHYTHMS[idx + 1];
  const Interactive = INTERACTIVES[data.slug];

  return (
    <div className="rl-wrap">
      <CornerNav />
      <div className="rl-prog-bar"><div className="rl-prog-fill" ref={rfillRef} /></div>

      {/* Cinematic hero image band */}
      <div className="rl-hero-band">
        <div className="rl-hero-bg" style={{ backgroundImage: `url('${data.img}')` }} />
        <div className="rl-hero-ov" />
        <div className="rl-hero-in">
          <img className="rl-hero-logo" src="/helmet.png" onError={e => { e.target.style.display = "none"; }} alt="" />
          <p className="rl-hero-eye">{data.rhythm} · Rule of Life</p>
          <h1 className="rl-hero-h1">{data.title}</h1>
          <p className="rl-hero-sub">{data.sub}</p>
        </div>
      </div>

      <div className="rl-content">

        {/* Pull quote */}
        <div className="rl-pullquote">
          <p>"{data.quote}"</p>
          <cite>— {data.quoteRef}</cite>
        </div>

        {/* Why this rhythm */}
        <div className="rl-section">
          <p className="rl-sec-label">Why This Rhythm</p>
          <div className="rl-body">
            {data.why.map((p, i) => (
              <p key={i} dangerouslySetInnerHTML={{ __html: p }} />
            ))}
          </div>
        </div>

        <div className="rl-rule" />

        {/* Theology */}
        <div className="rl-section">
          <p className="rl-sec-label">The Theological Foundation</p>
          <div className="rl-body">
            {data.theology.map((p, i) => (
              <p key={i} dangerouslySetInnerHTML={{ __html: p }} />
            ))}
          </div>
        </div>

        {/* Scripture */}
        <div className="rl-section">
          <p className="rl-sec-label">Scripture</p>
          {data.scriptures.map((s, i) => (
            <div className="rl-scripture" key={i}>
              <p>"{s.t}"</p>
              <cite>— {s.r}</cite>
            </div>
          ))}
        </div>

        <div className="rl-rule" />

        {/* Signature interactive element */}
        <div className="rl-section">
          <p className="rl-interactive-label">{data.interactiveLabel}</p>
          <Interactive />
        </div>

        <div className="rl-rule" />

        {/* The practice */}
        <div className="rl-section">
          <p className="rl-sec-label">The Practice</p>
          <p className="rl-body" style={{ marginBottom: "1.5rem" }}><p>{data.practice.intro}</p></p>
          <div className="rl-steps">
            {data.practice.steps.map((s, i) => (
              <div className="rl-step" key={i}>
                <div className="rl-step-head">
                  <span className="rl-step-num">{s.num}</span>
                  <span className="rl-step-title">{s.title}</span>
                </div>
                <p className="rl-step-body">{s.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rl-rule" />

        {/* Reflection */}
        <div className="rl-section">
          <p className="rl-sec-label">Questions for Reflection</p>
          <div className="rl-reflections">
            {data.reflection.map((q, i) => (
              <div className="rl-reflect-q" key={i}>{q}</div>
            ))}
          </div>
        </div>

        {/* Further reading */}
        <div className="rl-section">
          <p className="rl-sec-label">Go Deeper</p>
          <div className="rl-further">
            {data.further.map((b, i) => (
              <div className="rl-book" key={i}>
                <p className="rl-book-title">{b.title}</p>
                <p className="rl-book-author">{b.author}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Cross-link to 7-Day Challenge */}
        <div className="rl-section">
          <p className="rl-sec-label">Continue the Formation</p>
          <Link to={`/7-day-challenge/day/${data.challengeDay}`} className="rl-challenge-link">
            <div className="rl-challenge-link-left">
              <p>7-Day Challenge · Day {data.challengeDay}</p>
              <p>{data.challengeTitle}</p>
            </div>
            <span className="rl-challenge-arrow">→</span>
          </Link>
        </div>

        {/* Brand footer mark */}
        <div style={{ textAlign: "center", padding: "2rem 0 1rem", borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: "1rem" }}>
          <img src="/helmet.png" onError={e => { e.target.style.display = "none"; }} alt="" style={{ width: "26px", height: "26px", opacity: .2, filter: "invert(1)", margin: "0 auto .75rem", display: "block" }} />
          <p style={{ fontSize: "8px", letterSpacing: ".32em", textTransform: "uppercase", color: "rgba(255,255,255,0.18)" }}>Counter Formation · Formed in Christ · Ephesians 6:10–18</p>
        </div>

        {/* Rhythm navigation */}
        <div className="rl-rhythm-nav">
          {prev ? (
            <Link to={`${RULE_BASE}/${prev.slug}`} className="rl-nav-btn">
              <span>← {prev.rhythm}</span>{prev.title}
            </Link>
          ) : (
            <div style={{ flex: 1 }} />
          )}
          {next ? (
            <Link to={`${RULE_BASE}/${next.slug}`} className="rl-nav-btn">
              <span>{next.rhythm} →</span>{next.title}
            </Link>
          ) : (
            <div style={{ flex: 1 }} />
          )}
        </div>

      </div>

      <footer className="rl-footer">
        <img src="/helmet.png" onError={e => { e.target.style.display = "none"; }} alt="" />
        <p>Counter Formation · Rule of Life · Ephesians 6:10–18 · © 2026</p>
      </footer>
    </div>
  );
}