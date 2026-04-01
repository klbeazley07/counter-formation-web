import React, { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronDown, ArrowRight, Menu } from "lucide-react";

const SHOPIFY_URL = "https://shop.counterformed.com/collections/the-gear";

const C = {
  heroBg: "#06050A",
  ruleBg: "#17140F",
  gold:   "#C9A84C",
  ivory:  "#FAF8F5",
};

const ARMOR_PIECES = [
  {
    num: "01", slug: "belt-of-truth", title: "Belt of Truth",
    scripture: "Ephesians 6:14a",
    theology: "The belt was the first piece — everything else attached to it. Truth is foundational. Not abstract doctrine but lived reality.",
    tension: "Curated identity. Social media trains you to perform a self rather than know one.",
    practice: "Five-minute evening examination rooted in Ignatian Examen.",
    hook: "What would change if you stopped managing your image and started telling the truth?",
    product: null,
  },
  {
    num: "02", slug: "breastplate-of-righteousness", title: "Breastplate of Righteousness",
    scripture: "Ephesians 6:14b",
    theology: "Protects the heart. Positional righteousness, not moral performance. Christ's righteousness credited to you.",
    tension: "Performance engine. Worth = output.",
    practice: "Morning declaration spoken aloud.",
    hook: "What metric are you using to determine your worth today?",
    product: null,
  },
  {
    num: "03", slug: "gospel-of-peace", title: "Gospel of Peace",
    scripture: "Ephesians 6:15",
    theology: "Roman sandals had cleats for standing firm. Peace is grounding, not absence of conflict.",
    tension: "Anxiety as ambient condition. Systems engineered for reactivity.",
    practice: "\"Peace pause\" three times daily, sixty seconds of stillness.",
    hook: "What are you anxious about right now? What would it feel like to set it down?",
    product: null,
  },
  {
    num: "04", slug: "shield-of-faith", title: "Shield of Faith",
    scripture: "Ephesians 6:16",
    theology: "Full-body thureos soaked in water to quench fire arrows. Faith is positioning, not feeling.",
    tension: "Flaming arrows are lies about identity, God's character, whether obedience is worth it.",
    practice: "\"Arrow log\" to catch lies and answer with Scripture.",
    hook: "What lie keeps recurring? What would it take to simply refuse it?",
    product: "Drop 002 · Premium Everyday Tee",
  },
  {
    num: "05", slug: "helmet-of-salvation", title: "Helmet of Salvation",
    scripture: "Ephesians 6:17a",
    theology: "Protects the mind. Salvation as present reality and settled identity, not just future promise.",
    tension: "Mind is most contested territory. Anxiety, doom-scrolling, information overload.",
    practice: "\"Helmet check\" — morning identity declaration before digital input.",
    hook: "What is the first thing your mind reaches for in the morning?",
    product: "Drop 002 · Technical Hoodie",
  },
  {
    num: "06", slug: "sword-of-the-spirit", title: "Sword of the Spirit",
    scripture: "Ephesians 6:17b",
    theology: "Only offensive weapon. Scripture as living, active, spoken weapon. Rhema = specific utterance.",
    tension: "Biblical illiteracy at historic highs.",
    practice: "Scripture memorization, one verse per week.",
    hook: "Could you answer with Scripture — not the gist of it, but the words themselves?",
    product: "Drop 002 · Technical Tee",
  },
];

const DROP_PRODUCTS = [
  {
    slug: "helmet-of-salvation", num: "05", name: "Helmet of Salvation",
    product: "Technical Hoodie",
    hook: "What is the first thing your mind reaches for in the morning?",
    available: true,
  },
  {
    slug: "shield-of-faith", num: "04", name: "Shield of Faith",
    product: "Premium Everyday Tee",
    hook: "What lie keeps recurring? What would it take to simply refuse it?",
    available: true,
  },
  {
    slug: "sword-of-the-spirit", num: "06", name: "Sword of the Spirit",
    product: "Technical Tee",
    hook: "Could you answer with Scripture — not the gist of it, but the words themselves?",
    available: true,
  },
  {
    slug: "belt-of-truth", num: "01", name: "Belt of Truth",
    product: "Formation content · Product coming",
    hook: null, available: false,
  },
  {
    slug: "breastplate-of-righteousness", num: "02", name: "Breastplate of Righteousness",
    product: "Formation content · Product coming",
    hook: null, available: false,
  },
  {
    slug: "gospel-of-peace", num: "03", name: "Gospel of Peace",
    product: "Formation content · Product coming",
    hook: null, available: false,
  },
];

/* ─── ARMOR TRACKS DATA ──────────────────────────────────────────── */

const ARMOR_TRACKS = {
  "belt-of-truth": {
    num: "01",
    title: "Belt of Truth",
    trackTitle: "Living in the Light",
    img: "/Belt_wide.png",
    cumulative: "Written personal examination (5 weekly questions)",
    days: [
      {
        num: 1,
        title: "The First Piece",
        stillness: "Before you read today, slow down. You are not here to consume content. You are here to be formed. Take one breath. Set down whatever followed you into this moment. Arrive.",
        scriptures: [
          { text: "Stand firm then, with the belt of truth buckled around you.", ref: "Ephesians 6:14" },
          { text: "Then you will know the truth, and the truth will set you free.", ref: "John 8:32" },
          { text: "Surely you desire truth in the inward parts; you teach me wisdom in the inmost place.", ref: "Psalm 51:6" },
        ],
        teaching: [
          "There is a reason Paul starts with the belt.",
          "A Roman soldier did not begin with the sword or the shield. He began with the belt, the cingulum, a wide leather band cinched around the waist that gathered his tunic, held his scabbard, and anchored the breastplate. Without it, everything else hung loose. The armor didn't function. The soldier couldn't move. The belt was not the most visible piece, not the most dramatic, but it was the most foundational. Everything else attached to it.",
          "Paul knew what he was doing when he put truth first.",
          "Truth is not the most exciting piece of the spiritual armor. It doesn't carry the weight of salvation or the drama of the sword. But without it, nothing else holds. You cannot wear the breastplate of righteousness if you are not honest about where you are actually unrighteous. You cannot take up the shield of faith if you are lying to yourself about what you actually believe. You cannot wield the word of God if you are not willing to let it read you before you try to read it.",
          "Truth is the foundation. Not because it is the flashiest discipline, but because self-deception is the enemy's first and most effective strategy.",
          "Consider how it works. The serpent's opening move in Genesis 3 was not an assault. It was a distortion. \"Did God really say?\" The strategy has not changed. The enemy does not need you to reject God outright. He just needs you to live slightly out of alignment with reality. To believe a version of yourself that is curated rather than true. To maintain an image of your spiritual life that doesn't match what's actually happening behind closed doors. To tell God what you think He wants to hear rather than what is actually in your heart.",
          "Self-deception is the first casualty of the spiritual life, and most people don't even know it's happened.",
          "David understood this. Psalm 51:6 is stunning in its specificity. God desires truth in the inward parts. Not truth as public doctrine. Not truth as theological correctness. Truth in the places no one else sees. The parts of your interior life you've learned to manage, narrate, and present rather than expose.",
          "The belt of truth is not a belt of correct opinions. It is a belt of honest living: with God, with yourself, and with the people closest to you. It is the daily decision to stop performing and start being known.",
          "This is where formation begins. Not with a dramatic spiritual experience. Not with a new strategy or a better habit. With the willingness to tell the truth about where you actually are.",
        ],
        practice: {
          duration: "15 Minutes",
          body: "Find a quiet place. Open a journal or a blank document. Answer these three questions honestly. Not the version you would tell someone at church, but the version that is actually true.\n\nWhere am I pretending? What area of my life am I managing an image rather than living in reality?\n\nWhat am I avoiding? What conversation, confession, or confrontation have I been putting off because honesty would cost something?\n\nWhere am I with God, really? Not where I was six months ago. Not where I want to be. Where am I today?\n\nWrite your answers. Do not edit them. Do not spiritualize them. Just tell the truth on paper. This is not for anyone else. This is between you and God.",
        },
        reflection: "What would change if you stopped managing your image and started telling the truth: to God, to yourself, to one other person?",
        prayer: "God,\n\nI have been managing more than I have been living.\nThere are places in my life where the image I present and the reality underneath do not match, and I have gotten comfortable with the distance between them.\n\nI don't want to perform for you. You already see everything.\nTeach me to be honest, really honest, in the inward parts.\nNot as punishment. As freedom.\n\nTruth first. Before anything else holds, this has to.\n\nAmen.",
      },
      {
        num: 2,
        title: "The Lies We Tell Ourselves",
        stillness: "Before you begin, pause. You are not in a hurry. The truth you need today will not come through speed. It will come through stillness. Be here.",
        scriptures: [
          { text: "The heart is deceitful above all things, and desperately sick; who can understand it?", ref: "Jeremiah 17:9" },
          { text: "If we claim to be without sin, we deceive ourselves and the truth is not in us.", ref: "1 John 1:8" },
          { text: "Search me, God, and know my heart; test me and know my anxious thoughts. See if there is any offensive way in me, and lead me in the way everlasting.", ref: "Psalm 139:23-24" },
        ],
        teaching: [
          "The most dangerous lies are not the ones other people tell you. They are the ones you tell yourself.",
          "This is not a comfortable truth. Most of us think of deception as something that happens to us from the outside: a manipulative person, a misleading headline, a culture that distorts reality. And all of that is real. But Jeremiah's diagnosis cuts deeper. The heart itself is the problem. Not someone else's heart. Yours.",
          "Self-deception is not a dramatic act. It is almost never conscious. It works through small, quiet agreements you make with yourself over time. You tell yourself you're fine when you are not. You frame your anger as righteous when it is actually self-protective. You avoid confession by rebranding your sin as a struggle, your rebellion as a season, your disobedience as complexity. The language gets softer. The truth gets further away. And eventually, you cannot see the distance between who you say you are and who you actually are.",
          "This is what makes self-deception so effective. It does not feel like lying. It feels like coping.",
          "The psychologist Daniel Goleman calls this \"the vital lie,\" the story we construct to protect ourselves from truths that threaten our self-image. Every person has one. The workaholic tells himself he is providing for his family. The conflict-avoider tells herself she is keeping the peace. The spiritually disengaged man tells himself he is in a season of rest. The stories are not entirely false. That is what makes them so convincing. They contain just enough truth to feel reasonable, and just enough distortion to keep the real issue buried.",
          "The apostle John names it plainly. If we claim to be without sin, we deceive ourselves. Not others. Ourselves. The deception is internal before it is ever external. And once you have lied to yourself successfully, you no longer need anyone else to deceive you. You have done the enemy's work for him.",
          "So what breaks it?",
          "David's prayer in Psalm 139 is the antidote. \"Search me, God, and know my heart.\" This is not a prayer of confidence. It is a prayer of surrender. David is not saying, \"Look at me, I have nothing to hide.\" He is saying, \"I cannot see myself clearly. I need you to show me what I cannot see on my own.\"",
          "This is the daily work of the belt of truth. Not defending your self-image, but inviting God to dismantle it. Not proving that you are fine, but admitting that you might not be. The belt holds everything together precisely because it refuses to let you hold yourself together with a lie.",
        ],
        practice: {
          duration: "15 Minutes",
          body: "Today's practice builds on yesterday's honest inventory. Take out what you wrote and read it again.\n\nNow ask one harder question: What is my \"vital lie\"? What is the story I tell myself that keeps me from seeing something God wants me to see?\n\nIt might sound like one of these: \"I'm just wired this way.\" \"It's not that serious.\" \"I'll deal with it when things calm down.\" \"At least I'm not as bad as...\" \"God understands my situation.\"\n\nWrite down the story. Then write down what might be true underneath it, the thing the story is protecting you from having to face.\n\nYou do not have to fix it today. You just have to name it. Naming is the first act of truth.",
        },
        reflection: "What story have you been telling yourself that feels true but might be keeping you from growth?",
        prayer: "God,\n\nI am asking you to do something uncomfortable.\nSearch me. Know my heart. Show me the places where I have been lying to myself so long that the lie feels like the truth.\n\nI do not want to be someone who looks honest on the outside and is hiding on the inside.\n\nGive me the courage to name what I have been avoiding.\nGive me the grace to bring it to you without cleaning it up first.\n\nYou already know. Help me stop pretending you don't.\n\nAmen.",
      },
      {
        num: 3,
        title: "Honesty with God",
        stillness: "You do not need to prepare a speech for God. He is not an audience. He is a Father. Come as you are. That is the whole point.",
        scriptures: [
          { text: "O Lord, you have searched me and known me. You know when I sit down and when I rise up; you discern my thoughts from afar.", ref: "Psalm 139:1-2" },
          { text: "Pour out your hearts to him, for God is our refuge.", ref: "Psalm 62:8" },
          { text: "I do believe; help me overcome my unbelief!", ref: "Mark 9:24" },
        ],
        teaching: [
          "There is a version of prayer that most Christians default to without realizing it. It is polished. It is reverent. It uses the right words, strikes the right tone, and leaves out anything too raw, too confused, or too honest for the moment. It is, in the most precise sense of the word, a performance.",
          "And God is not interested in it.",
          "This is not an argument against reverence. God is holy, and approaching Him should carry weight. But reverence and performance are not the same thing. Reverence says, \"You are God and I am not.\" Performance says, \"Let me show you the version of me I think you want to see.\" One is worship. The other is management.",
          "The Psalms demolish the idea that prayer should be polished. David screams. He accuses. He questions God's faithfulness to His face. \"Why, Lord, do you stand far off? Why do you hide yourself in times of trouble?\" That is Psalm 10:1. It is in the Bible. Inspired. Holy. And completely unfiltered.",
          "The father in Mark 9 may be the most honest person in the Gospels. His son is suffering. He has brought the boy to Jesus' disciples, and they could not help. He comes to Jesus with whatever faith he has left, and what comes out of his mouth is not a creed. It is a contradiction: \"I do believe; help me overcome my unbelief.\" Both things are true at the same time. And Jesus does not correct him. He heals the boy.",
          "That is what honesty with God looks like. It is the willingness to bring the contradiction, the doubt, the anger, and the confusion without resolving it first. It is the refusal to edit your inner life before you bring it to the only One who can actually do something about it.",
          "Most people do not struggle with prayer because they lack discipline. They struggle with prayer because they have been trained, often by the church itself, to bring God a cleaned-up version of their interior life. And when the gap between what they actually feel and what they think they should feel becomes too wide, they stop coming altogether. Not because they have lost faith, but because they have lost the ability to be honest about the faith they actually have.",
          "The belt of truth applied to prayer means this: stop curating your conversations with God. Tell Him what is actually happening. If you are angry, say so. If you are doubting, say so. If you do not feel His presence and have not for months, say that. He already knows. Your honesty does not inform God. It frees you.",
        ],
        practice: {
          duration: "15 Minutes",
          body: "Set a timer. Open your journal or sit in silence with God. And pray the most honest prayer you have ever prayed.\n\nNo theological language unless it is genuinely yours. No phrases borrowed from someone else's faith. Just the truth.\n\nStart with this prompt if you need it: \"God, here is where I actually am with you right now.\"\n\nThen say whatever comes. If what comes is messy, contradictory, or uncomfortable, that is fine. That is the point. You are not performing. You are being known.\n\nWhen the timer ends, sit in the silence for one more minute. You do not need to hear anything back. The act of honesty is itself the formation.",
        },
        reflection: "When was the last time you told God something you were afraid to say out loud?",
        prayer: "God,\n\nI am tired of performing for you.\nYou already know everything I am trying to manage, and you have not left.\n\nTeach me to pray like David. Like the father in Mark 9. Like someone who would rather be honest and incomplete than polished and distant.\n\nI bring you what I actually have today. Not what I wish I had.\nThat is enough. Help me believe it is enough.\n\nAmen.",
      },
      {
        num: 4,
        title: "Honesty with Others",
        stillness: "Truth with God is the foundation. Truth with others is where it becomes costly. Take a breath. What you read today may ask something of you. Let it.",
        scriptures: [
          { text: "Therefore each of you must put off falsehood and speak truthfully to your neighbor, for we are all members of one body.", ref: "Ephesians 4:25" },
          { text: "Faithful are the wounds of a friend; profuse are the kisses of an enemy.", ref: "Proverbs 27:6" },
          { text: "Confess your sins to each other and pray for each other so that you may be healed.", ref: "James 5:16" },
        ],
        teaching: [
          "Honesty with God is freeing. Honesty with other people is terrifying.",
          "There is a reason for the difference. God already knows everything. The risk of honesty with Him is zero because there is nothing to lose. He has already seen the worst and has not walked away. But other people have not seen the worst. And the fear that drives most dishonesty in relationships is not the fear of being wrong. It is the fear of being known and then rejected.",
          "So we manage. We curate. We present the version of ourselves most likely to be accepted and least likely to be challenged. We avoid hard conversations because they might change how someone sees us. We hold back confession because vulnerability feels like weakness. We let conflict sit unresolved because the discomfort of tension feels safer than the risk of truth.",
          "And slowly, almost imperceptibly, our relationships become performances. Not lies exactly. Just edited versions of reality that keep everyone comfortable and no one truly known.",
          "Paul's instruction in Ephesians 4:25 is striking in its directness. Put off falsehood. Speak truthfully. Not because truth is always pleasant, but because we are members of one body. The metaphor matters. If your hand is injured and your brain refuses to acknowledge the pain, the whole body suffers. Dishonesty in community works the same way. It does not protect relationships. It hollows them out.",
          "Proverbs 27:6 names the paradox that most people spend their lives avoiding. The wounds of a friend are faithful. The people who love you enough to tell you the truth, even when it costs them your comfort, are the people who are actually fighting for you. And the people who only affirm, only agree, only tell you what you want to hear, are not being kind. They are being safe. There is a difference.",
          "James 5:16 takes it one step further. Confess your sins to each other. Not to God alone, although that comes first. To each other. Because something happens in the act of spoken confession to another human being that private confession cannot replicate. When you say the truth out loud to someone who is looking at you, the power of the secret breaks. Shame loses its grip. The thing that felt too heavy to carry alone suddenly has a witness, and the witness does not run.",
          "This is the most uncomfortable dimension of the belt of truth. It is not enough to be honest with God in the privacy of your prayer life. Truth must become embodied. It must enter your relationships, your conversations, your willingness to be known by at least one other person at the level of your actual reality, not your curated one.",
        ],
        practice: {
          duration: "15 Minutes",
          body: "This practice has two parts. The first you do alone. The second you do with another person.\n\nPart one (now): Identify one relationship where you have been managing an image rather than telling the truth. It might be a spouse, a close friend, a mentor, or a small group. Write down what you have been holding back and why.\n\nPart two (within 24 hours): Have the conversation. Not all of it, if the full truth is too complex for one sitting. But one honest statement. One thing you have been avoiding saying. One area where you have been editing yourself.\n\nBefore you speak, pray. After you speak, stay. Do not rush past the discomfort. Let the other person respond. This is the practice of being known.",
        },
        reflection: "Who in your life knows the real version of you, not just the version you are comfortable showing?",
        prayer: "God,\n\nHonesty with you is hard. Honesty with people is harder.\nI have been hiding behind edited versions of myself because the real version feels too risky to share.\n\nGive me one person. One conversation. One moment of truth that breaks through the management.\n\nI would rather be known and loved than admired and alone.\n\nHelp me take the risk.\n\nAmen.",
      },
      {
        num: 5,
        title: "Truth in a World of Distortion",
        stillness: "The noise outside you is loud. The noise inside you may be louder. Before you engage today's content, let both quiet. You are not here to win an argument. You are here to be formed.",
        scriptures: [
          { text: "Jesus answered, 'I am the way and the truth and the life.'", ref: "John 14:6" },
          { text: "Do not conform to the pattern of this world, but be transformed by the renewing of your mind.", ref: "Romans 12:2" },
          { text: "Buy the truth and do not sell it; wisdom, instruction, and insight as well.", ref: "Proverbs 23:23" },
        ],
        teaching: [
          "We live in what many have called a post-truth culture. The phrase is imprecise but the experience is real. Information is abundant and trust is scarce. Everyone has a platform. Everyone has a narrative. And the algorithms that organize your information diet are optimized not for truth but for engagement, which almost always means outrage, fear, or tribal reinforcement.",
          "The result is a formation system that shapes how you see reality before you even realize it is happening. You do not choose most of the information you consume. It is chosen for you, served to you based on what will keep you scrolling, clicking, and reacting. And over time, the accumulated weight of that consumption shapes your perception of the world, your neighbors, and even yourself.",
          "This is not primarily a political problem. It is a formation problem.",
          "The belt of truth in this context is not about having the right opinions on every issue. It is about something more fundamental: the willingness to hold your convictions with both firmness and humility. To believe deeply while acknowledging that your understanding is partial. To resist the tribal impulse that says everyone who disagrees with you is either stupid or evil.",
          "Jesus identified Himself as the truth. Not a truth. Not a perspective among perspectives. The truth. That is an absolute claim, and it should be held absolutely. But the way Jesus embodied truth was not tribal. He did not shout down His opponents. He asked questions. He told stories. He ate with people the religious establishment had written off. He held the truth with a kind of quiet, unshakable authority that did not need to dominate in order to be real.",
          "Romans 12:2 gives the formation instruction: do not conform. The Greek word is suschematizo, which means to be pressed into a mold from the outside. The world has a shape it wants to press you into, and it does not need your conscious agreement. It just needs your passive consumption. The antidote is not more information. It is the renewal of your mind, which is a slow, daily, Spirit-led process of learning to see reality through the lens of Scripture rather than through the lens of your feed.",
          "Proverbs 23:23 frames truth as something worth purchasing. Buy the truth and do not sell it. The implication is that truth has a cost, and there will always be pressure to trade it for something cheaper: comfort, belonging, applause, relevance. The belt of truth in a distorted world means refusing the trade. Holding truth even when it makes you unpopular with every side. Even when it costs you the easy tribal identity that comes from picking a team and never questioning it.",
        ],
        practice: {
          duration: "15 Minutes",
          body: "This is a diagnostic exercise. Take an honest inventory of your information diet over the past week.\n\nWhat were the primary sources of information and opinion that shaped your thinking? List them. Social media accounts, news outlets, podcasts, group chats, conversations.\n\nNow ask: Which of these sources are forming me toward truth, and which are forming me toward reactivity? Which make me more curious and humble, and which make me more certain and combative?\n\nChoose one source that consistently makes you more reactive than reflective. Fast from it for the remainder of this formation track. Replace the time with Scripture or silence.",
        },
        reflection: "Are you being formed by the truth, or by a tribe?",
        prayer: "God,\n\nThe world is loud and I have been listening to too much of it.\nI have let my convictions be shaped by feeds and algorithms more than I want to admit.\n\nRenew my mind. Not with more information, but with your truth.\nGive me the discernment to hold my convictions with both firmness and humility.\nTeach me to be shaped by your word before I am shaped by anyone else's.\n\nI want to be a person of truth, not a person of tribe.\n\nAmen.",
      },
      {
        num: 6,
        title: "The Examination",
        stillness: "This is the last day of this track, but it is not the end. What you build today is meant to outlast this week. Slow down. Receive what is here.",
        scriptures: [
          { text: "Examine yourselves to see whether you are in the faith; test yourselves.", ref: "2 Corinthians 13:5" },
          { text: "Let us examine our ways and test them, and let us return to the Lord.", ref: "Lamentations 3:40" },
          { text: "The unexamined life is not worth living.", ref: "Socrates, Plato's Apology" },
        ],
        teaching: [
          "The ancient church understood something that the modern church has largely forgotten: examination is not optional. It is essential.",
          "The practice of the Daily Examen, formalized by Ignatius of Loyola in the sixteenth century, was considered so important that Ignatius told his followers that if they could only do one spiritual practice in a day, this should be the one. Not prayer. Not Scripture reading. The Examen. Because without honest self-examination, every other spiritual practice becomes a performance. You can read Scripture and miss what it is saying to you. You can pray and never actually tell God the truth. You can attend church and remain completely unknown. But you cannot examine yourself honestly and stay the same.",
          "The Examen is simple. It is a nightly review of the day through two lenses: consolation and desolation. Where did I feel alive, connected, present to God today? That is consolation. Where did I feel drained, distant, pulled away from truth? That is desolation. The practice is not about guilt. It is about awareness. You are learning to see the patterns of your own formation, to notice where truth is gaining ground in your life and where deception is still operating.",
          "Over time, the Examen becomes a mirror. Not the kind of mirror you use to check your appearance, but the kind James describes: the mirror of God's word that shows you who you actually are. And the person who looks into that mirror and does not walk away unchanged is the person who is being formed.",
          "This is what the belt of truth looks like as a daily practice. It is not a one-time commitment to honesty. It is a rhythm. A nightly return to the truth about your day, your heart, and your God. It is the discipline that keeps every other piece of the armor honest.",
          "Over the past five days, you have been practicing honesty in layers: honesty about where you are, honesty about the lies you tell yourself, honesty with God, honesty with others, and honesty about what is forming your mind. Today, you build the structure that holds all of it together going forward.",
        ],
        practice: {
          duration: "20 Minutes",
          body: "Today you build your personal examination. This is your cumulative artifact for this track, the tool you will return to weekly as a truth discipline.\n\nWrite five questions that you will ask yourself at the end of each week. These should be specific to you, drawn from what God has shown you over the past five days. They should be honest enough to be uncomfortable and clear enough to be answerable.\n\nHere are examples to start from. Adapt them, replace them, or write your own:\n\nWhere did I perform this week instead of live honestly?\n\nWhat story am I telling myself that might not be true?\n\nDid I bring my real self to God in prayer, or a managed version?\n\nIs there a conversation I avoided because honesty would cost something?\n\nWhat shaped my thinking more this week: Scripture or my feed?\n\nWrite your five questions on a card, in a journal, or in your phone. Then commit to a time: one evening per week when you will sit with these questions and answer them honestly.\n\nFinally, tell one person what you have built and when you plan to do it. Not to perform it. To be held to it.",
        },
        reflection: "What has God shown you about truth this week that you do not want to forget?",
        prayer: "God,\n\nThank you for six days of honesty.\nSome of it was uncomfortable. Some of it was freeing. Most of it was both.\n\nI do not want to go back to managing my image. I want to live in the light.\n\nHelp me keep the examination. Not as a burden, but as a gift.\nA weekly return to the truth about who I am, where I am, and who you are.\n\nThe belt is on. Help me keep it buckled.\n\nAmen.",
      },
    ],
  },

  // Tracks 2-6 added in Task 2
};

function BackNav() {
  return (
    <Link
      to="/identity"
      className="fixed top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full text-[10px] tracking-[0.25em] uppercase font-bold transition-all"
      style={{
        backgroundColor: `${C.heroBg}cc`,
        backdropFilter: "blur(20px)",
        border: `1px solid ${C.ivory}10`,
        color: `${C.ivory}60`,
        textDecoration: "none",
      }}
    >
      ← Identity
    </Link>
  );
}

function HeroSection() {
  const sectionRef  = useRef(null);
  const eyebrowRef  = useRef(null);
  const headlineRef = useRef(null);
  const sublineRef  = useRef(null);
  const chevronRef  = useRef(null);
  const watermarkRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set([eyebrowRef.current, headlineRef.current, sublineRef.current, chevronRef.current], { opacity: 0, y: 20 });
      gsap.set(watermarkRef.current, { opacity: 0 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.to(watermarkRef.current,  { opacity: 0.10, duration: 2.0 })
        .to(eyebrowRef.current,    { opacity: 1,    y: 0, duration: 0.8 }, "-=1.5")
        .to(headlineRef.current,   { opacity: 1,    y: 0, duration: 0.9 }, "-=0.55")
        .to(sublineRef.current,    { opacity: 0.55, y: 0, duration: 0.8 }, "-=0.5")
        .to(chevronRef.current,    { opacity: 0.6,  y: 0, duration: 0.7 }, "-=0.4");

      // Chevron pulse
      gsap.to(chevronRef.current, {
        y: 8, duration: 1.4, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 2.5,
      });

      // Watermark parallax on scroll
      gsap.to(watermarkRef.current, {
        yPercent: -15,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: C.heroBg }}
    >
      {/* Hero image — very low opacity atmospheric */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/identity_wide.png')",
          backgroundSize: "cover",
          backgroundPosition: "center 20%",
          opacity: 0.18,
        }}
      />
      {/* Bottom-heavy gradient overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `linear-gradient(to top, ${C.heroBg} 0%, ${C.heroBg}ee 30%, ${C.heroBg}88 60%, ${C.heroBg}22 100%)`,
        }}
      />

      {/* Shield watermark — off-center atmospheric, parallax */}
      <div
        ref={watermarkRef}
        className="absolute inset-0 z-0 flex items-center pointer-events-none opacity-0"
        style={{ justifyContent: "flex-end", paddingRight: "8%" }}
      >
        <img
          src="/shield-white.png"
          alt=""
          style={{ height: "45vh", width: "auto", filter: "brightness(0) invert(1)" }}
        />
      </div>

      {/* Particle field — CSS radial-gradient dots */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: [
            "radial-gradient(circle at 22% 40%, rgba(255,255,255,0.12) 0.7px, transparent 1px)",
            "radial-gradient(circle at 65% 55%, rgba(255,255,255,0.09) 0.8px, transparent 1.2px)",
            "radial-gradient(circle at 42% 70%, rgba(255,255,255,0.08) 0.8px, transparent 1.2px)",
            "radial-gradient(circle at 55% 25%, rgba(255,255,255,0.10) 0.7px, transparent 1px)",
            "radial-gradient(circle at 78% 42%, rgba(255,255,255,0.07) 0.8px, transparent 1.2px)",
          ].join(","),
          backgroundSize: "340px 340px, 430px 430px, 370px 370px, 510px 510px, 390px 390px",
          filter: "blur(0.2px)",
          opacity: 0.6,
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl mx-auto">
        <span
          ref={eyebrowRef}
          className="text-[10px] md:text-[11px] tracking-[0.5em] uppercase font-bold mb-8 opacity-0"
          style={{ color: C.gold }}
        >
          The Identity Pillar · Ephesians 6:10–18
        </span>
        <h1
          ref={headlineRef}
          className="font-brand text-4xl md:text-8xl uppercase tracking-[0.1em] md:tracking-[0.14em] text-white leading-none mb-8 opacity-0"
        >
          You Are Being Formed
        </h1>
        <p
          ref={sublineRef}
          className="text-base md:text-xl leading-relaxed max-w-2xl opacity-0"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            color: `${C.ivory}88`,
          }}
        >
          Every satisfying explanation for your identity that doesn't start with God will eventually collapse under its own weight.
        </p>
      </div>

      {/* Chevron */}
      <div
        ref={chevronRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-0"
      >
        <div
          className="w-[1px] h-8"
          style={{ background: `linear-gradient(to bottom, transparent, ${C.gold}66)` }}
        />
        <ChevronDown size={16} color={C.gold} strokeWidth={1.5} />
      </div>
    </section>
  );
}

function ArmorIntroSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".armor-reveal").forEach(el => {
        gsap.from(el, {
          opacity: 0, y: 30,
          duration: 0.9, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none reverse" },
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 md:py-40 px-4" style={{ backgroundColor: C.heroBg }}>
      <div className="max-w-[740px] mx-auto">
        <span
          className="armor-reveal block text-[10px] tracking-[0.5em] uppercase font-bold mb-8"
          style={{ color: C.gold }}
        >
          Ephesians 6:10–18
        </span>

        <blockquote
          className="armor-reveal mb-12"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            fontSize: "clamp(16px, 2vw, 22px)",
            lineHeight: 1.85,
            color: `${C.ivory}cc`,
          }}
        >
          <p className="mb-5">
            Finally, be strong in the Lord and in his mighty power. Put on the full armor of God, so that you can take your stand against the devil's schemes. For our struggle is not against flesh and blood, but against the rulers, against the authorities, against the powers of this dark world and against the spiritual forces of evil in the heavenly realms.
          </p>
          <p className="mb-5">
            Therefore put on the full armor of God, so that when the day of evil comes, you may be able to stand your ground, and after you have done everything, to stand. Stand firm then, with the belt of truth buckled around your waist, with the breastplate of righteousness in place, and with your feet fitted with the readiness that comes from the gospel of peace.
          </p>
          <p>
            In addition to all this, take up the shield of faith, with which you can extinguish all the flaming arrows of the evil one. Take the helmet of salvation and the sword of the Spirit, which is the word of God.
          </p>
        </blockquote>

        <div
          className="armor-reveal h-[1px] mb-12"
          style={{ background: `linear-gradient(to right, transparent, ${C.gold}55, transparent)` }}
        />

        <div className="space-y-8">
          <p className="armor-reveal text-sm md:text-base leading-relaxed font-light" style={{ color: `${C.ivory}77` }}>
            Paul is writing to people under real pressure — not offering a metaphor for self-improvement but a survival framework for people living inside a hostile formation system. Rome's empire was total: emperor worship, cultural assimilation, a comprehensive narrative about power, identity, and worth. The parallel to the modern formation environment is not metaphorical. It is structural.
          </p>
          <p className="armor-reveal text-sm md:text-base leading-relaxed font-light" style={{ color: `${C.ivory}77` }}>
            The armor is not something you build. It is something you receive and put on. Identity in Christ is given, not constructed. The belt, the breastplate, the shield — each piece represents a dimension of God's own character that He extends to those who are in Christ. You are not assembling virtue through effort. You are stepping into what has already been provided.
          </p>
          <p className="armor-reveal text-sm md:text-base leading-relaxed font-light" style={{ color: `${C.ivory}77` }}>
            "Putting on" is a daily, deliberate act. You drift without it by default. The armor does not go on automatically — it requires intentional return, morning by morning, to the reality of who you are in Christ before the world has a chance to tell you otherwise. That is why this collection pairs every piece with a formation pathway.
          </p>
        </div>

        <div className="mt-20 flex justify-center pointer-events-none">
          <img
            src="/helmet.png"
            alt=""
            style={{ height: "100px", filter: "brightness(0) invert(1)", opacity: 0.06 }}
          />
        </div>
      </div>
    </section>
  );
}

function GodsArmorSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".godsarmor-reveal").forEach(el => {
        gsap.from(el, {
          opacity: 0, y: 30,
          duration: 0.9, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none reverse" },
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-24 md:py-40 px-4"
      style={{ background: `linear-gradient(to bottom, ${C.heroBg}, ${C.ruleBg})` }}
    >
      <div className="max-w-[1100px] mx-auto">
        <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-start">

          <div>
            <span
              className="godsarmor-reveal block text-[10px] tracking-[0.5em] uppercase font-bold mb-8"
              style={{ color: C.gold }}
            >
              The Revelation
            </span>
            <p className="godsarmor-reveal text-sm md:text-base leading-relaxed font-light mb-6" style={{ color: `${C.ivory}77` }}>
              The armor Paul describes is not a metaphor invented for the church. It is drawn from Isaiah's descriptions of God Himself. Isaiah 59:17 describes God putting on righteousness as a breastplate, salvation as a helmet. Isaiah 11:5 pictures the belt of faithfulness. Isaiah 52:7 speaks of feet bringing good news of peace.
            </p>
            <p className="godsarmor-reveal text-sm md:text-base leading-relaxed font-light mb-12" style={{ color: `${C.ivory}77` }}>
              When you put on the armor of God, you are not assembling your own defenses. You are stepping into God's own character — the same righteousness, the same salvation, the same peace that belong to Him. The armor is His before it is yours.
            </p>
            <p
              className="godsarmor-reveal text-lg md:text-2xl tracking-[0.12em] uppercase font-bold leading-tight"
              style={{ fontFamily: "'Michroma', sans-serif", color: C.gold }}
            >
              "You are not inventing identity. You are receiving it."
            </p>
          </div>

          <div className="godsarmor-reveal">
            <div className="border-l-2 pl-8" style={{ borderColor: `${C.gold}33` }}>
              <span
                className="block text-[9px] tracking-[0.4em] uppercase mb-6"
                style={{ color: `${C.gold}77` }}
              >
                Isaiah 59:17
              </span>
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontStyle: "italic",
                  fontSize: "clamp(22px, 3.5vw, 48px)",
                  lineHeight: 1.3,
                  color: `${C.ivory}bb`,
                }}
              >
                He put on righteousness as his breastplate, and the helmet of salvation on his head.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

function SixPiecesSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".piece-block").forEach(el => {
        gsap.from(el, {
          opacity: 0, y: 40,
          duration: 1.0, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none reverse" },
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 md:py-40 px-4" style={{ backgroundColor: C.ruleBg }}>
      <div className="max-w-[1100px] mx-auto">

        <div className="mb-16 md:mb-24">
          <span className="block text-[10px] tracking-[0.5em] uppercase font-bold mb-4" style={{ color: C.gold }}>
            The Six Pieces
          </span>
          <h2 className="font-brand text-3xl md:text-6xl uppercase tracking-[0.1em] text-white leading-none">
            The Armor of God
          </h2>
        </div>

        <div className="space-y-28 md:space-y-44">
          {ARMOR_PIECES.map((piece, i) => (
            <div
              key={piece.slug}
              className={`piece-block relative grid md:grid-cols-2 gap-12 md:gap-20 items-start ${i % 2 === 1 ? "md:[direction:rtl]" : ""}`}
            >
              <div
                className="absolute inset-0 flex items-center pointer-events-none overflow-hidden"
                style={{ justifyContent: i % 2 === 0 ? "flex-end" : "flex-start" }}
              >
                <span
                  style={{
                    fontFamily: "'Michroma', sans-serif",
                    fontSize: "clamp(140px, 20vw, 260px)",
                    fontWeight: 700,
                    color: `${C.ivory}07`,
                    lineHeight: 1,
                    userSelect: "none",
                  }}
                >
                  {piece.num}
                </span>
              </div>

              <div className={i % 2 === 1 ? "md:[direction:ltr]" : ""}>
                <div className="flex items-baseline gap-4 mb-6">
                  <span className="text-[9px] tracking-[0.4em] uppercase" style={{ color: `${C.gold}77` }}>
                    {piece.num}
                  </span>
                  <div className="h-[1px] flex-1" style={{ background: `${C.gold}22` }} />
                </div>
                <h3 className="font-brand text-2xl md:text-4xl uppercase tracking-[0.1em] text-white mb-3">
                  {piece.title}
                </h3>
                <p className="text-[10px] tracking-[0.35em] uppercase mb-8" style={{ color: `${C.gold}99` }}>
                  {piece.scripture}
                </p>

                <div className="space-y-6">
                  <div>
                    <span className="text-[9px] tracking-[0.35em] uppercase block mb-2" style={{ color: `${C.ivory}44` }}>
                      Theology
                    </span>
                    <p className="text-sm md:text-base leading-relaxed font-light" style={{ color: `${C.ivory}77` }}>
                      {piece.theology}
                    </p>
                  </div>
                  <div>
                    <span className="text-[9px] tracking-[0.35em] uppercase block mb-2" style={{ color: `${C.ivory}44` }}>
                      Modern Tension
                    </span>
                    <p className="text-sm leading-relaxed font-light" style={{ color: `${C.ivory}55` }}>
                      {piece.tension}
                    </p>
                  </div>
                  <div>
                    <span className="text-[9px] tracking-[0.35em] uppercase block mb-2" style={{ color: `${C.ivory}44` }}>
                      Daily Practice
                    </span>
                    <p className="text-sm leading-relaxed font-light" style={{ color: `${C.ivory}66` }}>
                      {piece.practice}
                    </p>
                  </div>
                </div>

                <blockquote
                  className="mt-8 pl-4 border-l"
                  style={{
                    borderColor: `${C.gold}33`,
                    fontFamily: "'Cormorant Garamond', serif",
                    fontStyle: "italic",
                    fontSize: "16px",
                    color: `${C.ivory}88`,
                  }}
                >
                  "{piece.hook}"
                </blockquote>

                <div className="mt-8 flex items-center gap-5">
                  <Link
                    to={`/identity/${piece.slug}`}
                    className="text-[10px] tracking-[0.3em] uppercase font-bold flex items-center gap-2 transition-opacity hover:opacity-100"
                    style={{ color: C.gold, opacity: 0.8, textDecoration: "none" }}
                  >
                    Explore this piece
                    <ArrowRight size={12} />
                  </Link>
                  {piece.product && (
                    <span className="text-[9px] tracking-[0.28em] uppercase" style={{ color: `${C.ivory}33` }}>
                      {piece.product}
                    </span>
                  )}
                </div>
              </div>

              <div className={`hidden md:flex items-center justify-center ${i % 2 === 1 ? "md:[direction:ltr]" : ""}`}>
                <div
                  className="w-full rounded-2xl relative overflow-hidden"
                  style={{
                    aspectRatio: "3/4",
                    background: `linear-gradient(135deg, ${C.heroBg} 0%, ${C.ruleBg} 100%)`,
                    border: `1px solid ${C.ivory}0A`,
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span
                      style={{
                        fontFamily: "'Michroma', sans-serif",
                        fontSize: "clamp(60px, 8vw, 100px)",
                        fontWeight: 700,
                        color: `${C.gold}12`,
                      }}
                    >
                      {piece.num}
                    </span>
                  </div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="text-[9px] tracking-[0.3em] uppercase" style={{ color: `${C.gold}44` }}>
                      {piece.product || "Formation content · Coming soon"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BrandSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".brand-reveal").forEach(el => {
        gsap.from(el, {
          opacity: 0, y: 24,
          duration: 0.9, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none reverse" },
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 md:py-40 px-4" style={{ backgroundColor: C.ruleBg }}>
      <div className="max-w-[740px] mx-auto">
        <span
          className="brand-reveal block text-[10px] tracking-[0.5em] uppercase font-bold mb-8"
          style={{ color: C.gold }}
        >
          Why the Armor
        </span>
        <div className="space-y-8">
          <p className="brand-reveal text-sm md:text-base leading-relaxed font-light" style={{ color: `${C.ivory}77` }}>
            The armor is not a costume. It is what God has provided for people who are being formed in a system that is actively working against them. Every culture in history has had a comprehensive formation project — a set of values, narratives, and practices designed to shape people into its image. The digital age is no different, except that its reach is total and its pace is unprecedented.
          </p>
          <p className="brand-reveal text-sm md:text-base leading-relaxed font-light" style={{ color: `${C.ivory}77` }}>
            The gear is not the armor. It is a marker — a daily reminder that you belong to a different formation project. The QR code connects to the formation content: the theology, the practice, the community. The garment anchors the identity. The content forms it.
          </p>
          <p className="brand-reveal text-sm md:text-base leading-relaxed font-light" style={{ color: `${C.ivory}77` }}>
            The gear is the entry point. The content is the formation. The practice is the armor. These three move together, or they don't move at all.
          </p>
        </div>
        <div className="brand-reveal mt-16">
          <p
            className="text-lg md:text-2xl tracking-[0.14em] uppercase font-bold leading-tight"
            style={{ fontFamily: "'Michroma', sans-serif", color: C.gold }}
          >
            "The gear is not the mission. It's a marker of it."
          </p>
        </div>
      </div>
    </section>
  );
}

function CollectionSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".drop-card").forEach(el => {
        gsap.from(el, {
          opacity: 0, y: 30,
          duration: 0.85, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none reverse" },
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-24 md:py-40 px-4"
      style={{ background: `linear-gradient(to bottom, ${C.ruleBg}, #1A1510)` }}
    >
      <div className="max-w-[1100px] mx-auto">
        <div className="mb-16 md:mb-24 flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
          <div>
            <span
              className="block text-[10px] tracking-[0.5em] uppercase font-bold mb-4"
              style={{ color: C.gold }}
            >
              Drop 002 · The Armor of God
            </span>
            <h2 className="font-brand text-3xl md:text-6xl uppercase tracking-[0.1em] text-white leading-none">
              The Collection
            </h2>
          </div>
          <p
            className="max-w-sm text-xs md:text-sm leading-relaxed font-light md:text-right"
            style={{ color: `${C.ivory}44` }}
          >
            Three hero pieces. Six formation pathways. One armor.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {DROP_PRODUCTS.map(p => (
            <Link
              key={p.slug}
              to={`/identity/${p.slug}`}
              className="drop-card group relative rounded-2xl overflow-hidden flex flex-col transition-all duration-500"
              style={{
                textDecoration: "none",
                minHeight: "320px",
                background: `${C.ivory}05`,
                border: `1px solid ${C.ivory}${p.available ? "0F" : "07"}`,
              }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-[1px]"
                style={{
                  background: `linear-gradient(to right, transparent, ${C.gold}${p.available ? "55" : "22"}, transparent)`,
                }}
              />
              <div className="p-6 md:p-8 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-6">
                  <span
                    className="text-[9px] tracking-[0.4em] uppercase"
                    style={{ color: `${C.gold}${p.available ? "99" : "44"}` }}
                  >
                    {p.num}
                  </span>
                  {p.available && (
                    <span
                      className="text-[8px] tracking-[0.3em] uppercase px-2 py-1 rounded-full"
                      style={{ color: C.gold, border: `1px solid ${C.gold}33` }}
                    >
                      Drop 002
                    </span>
                  )}
                </div>
                <h3
                  className="font-brand text-base uppercase tracking-[0.1em] mb-2"
                  style={{ color: p.available ? C.ivory : `${C.ivory}44` }}
                >
                  {p.name}
                </h3>
                <p
                  className="text-[11px] tracking-[0.2em] uppercase mb-6"
                  style={{ color: p.available ? `${C.ivory}55` : `${C.ivory}22` }}
                >
                  {p.product}
                </p>
                {p.hook && (
                  <p
                    className="text-[13px] leading-relaxed mt-auto"
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontStyle: "italic",
                      color: `${C.ivory}66`,
                    }}
                  >
                    "{p.hook}"
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section
      className="py-24 md:py-48 px-4 text-center"
      style={{ backgroundColor: C.heroBg }}
    >
      <div className="max-w-2xl mx-auto">

        <div className="flex flex-col items-center gap-4 mb-20">
          <Link
            to="/identity/belt-of-truth"
            className="inline-flex items-center gap-3 px-10 py-4 rounded-full font-bold text-[11px] tracking-[0.28em] uppercase transition-all hover:scale-105"
            style={{
              backgroundColor: C.gold,
              color: "#0A0A0A",
              boxShadow: `0 4px 32px ${C.gold}44`,
              textDecoration: "none",
            }}
          >
            Begin Formation
            <ArrowRight size={14} />
          </Link>
          <a
            href={SHOPIFY_URL}
            className="inline-flex items-center gap-3 px-10 py-4 rounded-full font-bold text-[11px] tracking-[0.28em] uppercase transition-all hover:bg-white/5"
            style={{ color: C.gold, border: `1px solid ${C.gold}44`, textDecoration: "none" }}
          >
            Explore the Collection
          </a>
        </div>

        <div>
          <p
            className="text-base md:text-xl leading-relaxed mb-3"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              color: `${C.ivory}55`,
            }}
          >
            "Be strong in the Lord and in his mighty power. Put on the full armor of God."
          </p>
          <p className="text-[10px] tracking-[0.4em] uppercase" style={{ color: `${C.ivory}33` }}>
            Ephesians 6:10–11
          </p>
        </div>

        <div className="mt-16 flex flex-col items-center gap-4">
          <img
            src="/helmet.png"
            alt=""
            style={{ height: "44px", filter: "brightness(0) invert(1)", opacity: 0.08 }}
          />
          <p className="text-[9px] tracking-[0.4em] uppercase" style={{ color: `${C.ivory}22` }}>
            Discipline · Presence · Formation
          </p>
        </div>

      </div>
    </section>
  );
}

function SiteNav() {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const navLinks = [
    { label: "Formation",    href: "/#architecture" },
    { label: "Rule of Life", href: "/#rule" },
  ];
  return (
    <>
      <nav className="fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-[100] w-[94%] max-w-5xl px-4 py-3 md:px-5 md:py-4 backdrop-blur-2xl border border-white/10 rounded-2xl flex items-center justify-between"
        style={{ backgroundColor: `${C.heroBg}cc` }}>
        <a href="/" className="flex items-center gap-2 md:gap-3">
          <img src="/helmet.png" className="w-8 h-8 md:w-10 md:h-10 object-contain flex-shrink-0" alt="Counter Formation" />
          <span className="font-brand text-[11px] md:text-sm tracking-[0.2em] md:tracking-[0.28em] uppercase whitespace-nowrap text-[#FAF8F5]">
            Counter Formation
          </span>
        </a>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex gap-8 mr-4 text-[10px] uppercase tracking-widest font-brand font-bold">
            {navLinks.map(l => (
              <a key={l.label} href={l.href}
                className="text-[#FAF8F5] hover:text-[#C9A84C] transition-colors">
                {l.label}
              </a>
            ))}
          </div>
          <a href="/#shop"
            className="px-5 py-2 rounded-full border border-[#C9A84C]/40 text-[#C9A84C] hover:bg-[#C9A84C] hover:text-black transition-all text-[9px] md:text-[10px] hidden md:block uppercase tracking-widest font-bold">
            Shop the Gear
          </a>
          <button onClick={() => setMenuOpen(v => !v)} className="md:hidden p-1 text-[#FAF8F5]" aria-label="Toggle menu">
            <Menu size={20} />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`fixed inset-0 z-[120] flex flex-col items-center justify-center transition-transform duration-500 md:hidden ${menuOpen ? "translate-y-0" : "-translate-y-full"}`}
        style={{ backgroundColor: C.heroBg }}>
        <button onClick={() => setMenuOpen(false)} className="absolute top-6 right-6 text-[#FAF8F5]" aria-label="Close menu">
          ✕
        </button>
        <div className="flex flex-col items-center gap-10">
          {navLinks.map(l => (
            <a key={l.label} href={l.href} onClick={() => setMenuOpen(false)}
              className="font-brand text-2xl uppercase tracking-widest text-[#FAF8F5] hover:text-[#C9A84C] transition-colors">
              {l.label}
            </a>
          ))}
          <a href="/#shop" onClick={() => setMenuOpen(false)}
            className="mt-4 px-8 py-3 rounded-full border border-[#C9A84C]/40 text-[#C9A84C] uppercase tracking-widest font-bold text-sm">
            Shop the Gear
          </a>
        </div>
      </div>
    </>
  );
}

export function IdentityLanding() {
  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    return () => {
      if ("scrollRestoration" in history) {
        history.scrollRestoration = "auto";
      }
    };
  }, []);
  return (
    <div className="text-[#FAF8F5] overflow-x-hidden" style={{ backgroundColor: C.heroBg }}>
      <SiteNav />
      <HeroSection />
      <ArmorIntroSection />
      <GodsArmorSection />
      <SixPiecesSection />
      <BrandSection />
      <CollectionSection />
      <CTASection />
    </div>
  );
}

export function ArmorPiecePlaceholder() {
  const location = useLocation();
  const slug = location.pathname.replace("/identity/", "");
  const armorPiece = ARMOR_PIECES.find(p => p.slug === slug);

  if (!armorPiece) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center"
        style={{ backgroundColor: C.heroBg }}
      >
        <Link
          to="/identity"
          style={{ color: C.gold, textDecoration: "none", fontSize: "12px", letterSpacing: "0.3em" }}
        >
          ← Back to Identity
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-[#FAF8F5]" style={{ backgroundColor: C.heroBg }}>
      <BackNav />

      <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center max-w-2xl mx-auto">
        <span
          className="text-[10px] tracking-[0.5em] uppercase font-bold mb-6"
          style={{ color: C.gold }}
        >
          {armorPiece.num} · The Armor of God
        </span>
        <h1 className="font-brand text-3xl md:text-7xl uppercase tracking-[0.1em] text-white mb-6 leading-none">
          {armorPiece.title}
        </h1>
        <p
          className="text-[11px] tracking-[0.3em] uppercase mb-10"
          style={{ color: `${C.ivory}44` }}
        >
          {armorPiece.scripture}
        </p>
        <p
          className="text-sm md:text-base leading-relaxed max-w-md mb-6 font-light"
          style={{ color: `${C.ivory}55` }}
        >
          {armorPiece.theology}
        </p>
        <blockquote
          className="mb-12 text-base leading-relaxed max-w-sm"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            color: `${C.ivory}66`,
          }}
        >
          "{armorPiece.hook}"
        </blockquote>
        <span
          className="text-[10px] tracking-[0.4em] uppercase px-6 py-3 rounded-full"
          style={{ color: `${C.ivory}33`, border: `1px solid ${C.ivory}10` }}
        >
          Full formation page coming soon
        </span>
      </div>
    </div>
  );
}
