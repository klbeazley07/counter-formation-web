import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import { ScriptureRef } from "./ScriptureRef";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronDown, ArrowRight, Menu } from "lucide-react";
import { ExamenWidget }       from "./widgets/ExamenWidget";
import { DeclarationWidget }  from "./widgets/DeclarationWidget";
import { PeacePauseWidget }   from "./widgets/PeacePauseWidget";
import { ArrowLogWidget }     from "./widgets/ArrowLogWidget";
import { FirstFifteenWidget } from "./widgets/FirstFifteenWidget";
import { VerseTrackerWidget } from "./widgets/VerseTrackerWidget";
import { FormationShareable } from "./FormationShareable";
import { parseScriptureRefs } from "./utils/parseScriptureRefs";

const SHOPIFY_URL = "https://shop.counterformed.com/collections/armor-of-god-collection";

const C = {
  heroBg: "#06050A",
  ruleBg: "#17140F",
  gold:   "#C9A84C",
  ivory:  "#FAF8F5",
};

const ARMOR_PIECES = [
  {
    num: "01", slug: "belt-of-truth", title: "Belt of Truth", icon: "/Belt_white_icon.png",
    scripture: "Ephesians 6:14",
    scriptureText: "Stand firm then, with the belt of truth buckled around your waist.",
    theology: "The belt was the first piece — everything else attached to it. Truth is foundational. Not abstract doctrine but lived reality.",
    tension: "Curated identity. Social media trains you to perform a self rather than know one.",
    practice: "Five-minute evening examination rooted in Ignatian Examen.",
    hook: "What would change if you stopped managing your image and started telling the truth?",
    product: null,
  },
  {
    num: "02", slug: "breastplate-of-righteousness", title: "Breastplate of Righteousness", icon: "/Breastplate_white_icon.png",
    scripture: "Ephesians 6:14",
    scriptureText: "Stand firm then, with the breastplate of righteousness in place.",
    theology: "Protects the heart. Positional righteousness, not moral performance. Christ's righteousness credited to you.",
    tension: "Performance engine. Worth = output.",
    practice: "Morning declaration spoken aloud.",
    hook: "What metric are you using to determine your worth today?",
    product: null,
  },
  {
    num: "03", slug: "gospel-of-peace", title: "Gospel of Peace", icon: "/Sandal_white_icon.png",
    scripture: "Ephesians 6:15",
    scriptureText: "And with your feet fitted with the readiness that comes from the gospel of peace.",
    theology: "Roman sandals had cleats for standing firm. Peace is grounding, not absence of conflict.",
    tension: "Anxiety as ambient condition. Systems engineered for reactivity.",
    practice: "\"Peace pause\" three times daily, sixty seconds of stillness.",
    hook: "What are you anxious about right now? What would it feel like to set it down?",
    product: null,
  },
  {
    num: "04", slug: "shield-of-faith", title: "Shield of Faith", icon: "/Shield_white_icon.png",
    scripture: "Ephesians 6:16",
    scriptureText: "In addition to all this, take up the shield of faith, with which you can extinguish all the flaming arrows of the evil one.",
    theology: "Full-body thureos soaked in water to quench fire arrows. Faith is positioning, not feeling.",
    tension: "Flaming arrows are lies about identity, God's character, whether obedience is worth it.",
    practice: "\"Arrow log\" to catch lies and answer with Scripture.",
    hook: "What lie keeps recurring? What would it take to simply refuse it?",
    product: "Drop 002 · Premium Everyday Tee",
  },
  {
    num: "05", slug: "helmet-of-salvation", title: "Helmet of Salvation", icon: "/Helmet_white_icon.png",
    scripture: "Ephesians 6:17",
    scriptureText: "Take the helmet of salvation and the sword of the Spirit, which is the word of God.",
    theology: "Protects the mind. Salvation as present reality and settled identity, not just future promise.",
    tension: "Mind is most contested territory. Anxiety, doom-scrolling, information overload.",
    practice: "\"Helmet check\" — morning identity declaration before digital input.",
    hook: "What is the first thing your mind reaches for in the morning?",
    product: "Drop 002 · Technical Hoodie",
  },
  {
    num: "06", slug: "sword-of-the-spirit", title: "Sword of the Spirit", icon: "/Sword_white_icon.png",
    scripture: "Ephesians 6:17",
    scriptureText: "Take the sword of the Spirit, which is the word of God.",
    theology: "Only offensive weapon. Scripture as living, active, spoken weapon. Rhema = specific utterance.",
    tension: "Biblical illiteracy at historic highs.",
    practice: "Scripture memorization, one verse per week.",
    hook: "Could you answer with Scripture — not the gist of it, but the words themselves?",
    product: "Drop 002 · Technical Tee",
  },
];

/* ─── ARMOR TRACKS DATA ──────────────────────────────────────────── */

const ARMOR_TRACKS = {
  "belt-of-truth": {
    num: "01",
    title: "Belt of Truth",
    icon: "/Belt_white_icon.png",
    trackTitle: "Living in the Light",
    img: "/Belt of Truth_Hero_wide.png",
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
          "The breastplate of righteousness has no grip if you aren't honest about where you're actually unrighteous. The shield of faith doesn't hold if you're lying to yourself about what you actually believe. The word of God won't do what it's meant to do if you're not willing to let it read you before you try to read it. Truth comes first because self-deception is the enemy's first strategy -- and the most effective one -- precisely because it isn't dramatic. It works quietly, at the foundation, before anything else gets a chance to function.",
          "Consider how it works. The serpent's opening move in Genesis 3 was not an assault. It was a distortion. \"Did God really say?\" The strategy has not changed. The enemy does not need you to reject God outright. He just needs you to live slightly out of alignment with reality. To believe a version of yourself that is curated rather than true. To maintain an image of your spiritual life that doesn't match what's actually happening behind closed doors. To tell God what you think He wants to hear rather than what is actually in your heart.",
          "Self-deception is the first casualty of the spiritual life, and most people don't even know it's happened.",
          "David understood this. Psalm 51:6 is stunning in its specificity. God desires truth in the inward parts -- not truth as public doctrine, not truth as theological correctness, but truth in the places no one else sees. The parts of your interior life you've learned to manage, narrate, and present rather than expose.",
          "The belt of truth is a commitment to honest living: with God, with yourself, and with the people closest to you. The daily decision to stop performing and start being known. Formation doesn't begin with a dramatic spiritual experience or a better habit. It begins with the willingness to tell the truth about where you actually are -- and to keep telling it."
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
          "We tend to think of deception as something that happens from the outside: a manipulative person, a misleading headline, a culture that distorts reality. All of that is real. But Jeremiah's diagnosis cuts deeper. The heart itself is the problem. Yours, specifically.",
          "Self-deception is not a dramatic act. It is almost never conscious. It works through small, quiet agreements you make with yourself over time. You tell yourself you're fine when you are not. You frame your anger as righteous when it is actually self-protective. You avoid confession by rebranding your sin as a struggle, your rebellion as a season, your disobedience as complexity. The language gets softer. The truth gets further away. Eventually you cannot see the distance between who you say you are and who you actually are.",
          "What makes this so effective is that it does not feel like lying. It feels like coping.",
          "The psychologist Daniel Goleman calls this \"the vital lie\" -- the story we construct to protect ourselves from truths that threaten our self-image. Every person has one. The workaholic tells himself he is providing for his family. The conflict-avoider tells herself she is keeping the peace. The spiritually disengaged man tells himself he is in a season of rest. The stories are not entirely false. That is what makes them so convincing. They contain just enough truth to feel reasonable, and just enough distortion to keep the real issue buried.",
          "John names it plainly. If we claim to be without sin, we deceive ourselves. The deception is internal before it is ever external, and once you have lied to yourself successfully, you no longer need anyone else to deceive you. You've done the enemy's work for him.",
          "So what breaks it?",
          "David's prayer in Psalm 139 is the answer, but notice what kind of prayer it is. \"Search me, God, and know my heart.\" This is surrender, not confidence. David is not saying he has nothing to hide. He is saying he cannot see himself clearly and needs God to show him what he cannot see on his own.",
          "The daily work of the belt of truth is not self-examination you control. It is an invitation to God to examine what you cannot. The belt holds everything together precisely because it refuses to let you hold yourself together with a lie."
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
          "Reverence is not the issue. God is holy, and approaching Him should carry weight. But reverence and performance are different things. Reverence says, \"You are God and I am not.\" Performance says, \"Let me show you the version of me I think you want to see.\" One is worship. The other is management -- and God has no use for a managed relationship.",
          "The Psalms demolish the idea that prayer should be polished. David screams. He accuses. He questions God's faithfulness to His face. \"Why, Lord, do you stand far off? Why do you hide yourself in times of trouble?\" That is Psalm 10:1. It is in the Bible. Inspired. Holy. And completely unfiltered.",
          "The father in Mark 9 may be the most honest person in the Gospels. His son is suffering. He has brought the boy to Jesus' disciples, and they could not help. He comes to Jesus with whatever faith he has left, and what comes out of his mouth is not a creed. It is a contradiction: \"I do believe; help me overcome my unbelief.\" Both things are true at the same time. And Jesus does not correct him. He heals the boy.",
          "That is the permission the Psalms and Mark 9 give you. Bring the contradiction. Bring the doubt, the anger, and the confusion without resolving it first. Don't edit your interior life before you bring it to the only One who can actually do something about it.",
          "Prayer struggles are rarely about discipline. More often they come from a long training -- sometimes from the church itself -- to bring God a cleaned-up version of your interior life. When the gap between what you actually feel and what you think you should feel becomes too wide, people stop coming altogether. Not because they've lost faith, but because they've lost the ability to be honest about the faith they actually have.",
          "The belt of truth applied to prayer is straightforward: stop curating your conversations with God. Tell Him what is actually happening. If you are angry, say so. If you are doubting, say so. If you do not feel His presence and have not for months, say that. He already knows. Your honesty does not inform God. It frees you."
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
          "There is a reason for the difference. God already knows everything -- the risk of honesty with Him is functionally zero, because there is nothing left to lose. He has already seen the worst and has not walked away. But other people have not seen the worst. And the fear that drives most dishonesty in relationships is not the fear of being wrong. It is the fear of being fully known and then rejected anyway.",
          "So we manage. We curate. We present the version of ourselves most likely to be accepted and least likely to be challenged. We avoid hard conversations because they might change how someone sees us. We hold back confession because vulnerability feels like weakness. We let conflict sit unresolved because the discomfort of tension feels safer than the risk of truth.",
          "And slowly, almost imperceptibly, our relationships become performances -- not lies exactly, just edited versions of reality that keep everyone comfortable and no one truly known.",
          "Paul's instruction in Ephesians 4:25 is striking in its directness. Put off falsehood. Speak truthfully. The reason he gives is not primarily moral obligation but shared life: we are members of one body. The metaphor matters. If your hand is injured and your brain refuses to acknowledge the pain, the whole body suffers. Dishonesty in community hollows out relationships quietly, over time, until there is nothing left to protect.",
          "Proverbs 27:6 names the paradox that most people spend their lives avoiding. The wounds of a friend are faithful. The people who love you enough to tell you the truth, even when it costs them your comfort, are the people actually fighting for you. The people who only affirm and agree are not being kind. They are being safe. There is a difference worth knowing.",
          "James 5:16 goes further still. Confess your sins to each other. The confession that matters is not only the private kind between you and God, as foundational as that is. Something happens in the act of spoken confession to another human being that private confession cannot replicate. When you say the truth out loud to someone who is looking at you, the power of the secret breaks. Shame loses its grip. The thing that felt too heavy to carry alone suddenly has a witness, and the witness does not run.",
          "Truth must become embodied. It has to enter your relationships, your conversations, your willingness to be known by at least one other person at the level of your actual reality. The belt doesn't hold in private only. It has to hold in community too -- and that is the harder, more costly, and ultimately more freeing dimension of it."
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
          "We live in what many have called a post-truth culture. The phrase is imprecise but the experience is real. Information is abundant and trust is scarce. Everyone has a platform. Everyone has a narrative. The algorithms that organize your information diet are not optimized for truth -- they are optimized for engagement, which almost always means outrage, fear, or tribal reinforcement.",
          "The result is a formation system that shapes how you see reality before you realize it is happening. You do not choose most of the information you consume. It is chosen for you, served to you based on what will keep you scrolling, clicking, and reacting. Over time, the accumulated weight of that consumption shapes your perception of the world, your neighbors, and yourself.",
          "This is a formation problem before it is a political one.",
          "The belt of truth in this context is not about having the right opinions on every issue. It is about something more fundamental: the willingness to hold your convictions with both firmness and humility. To believe deeply while acknowledging that your understanding is partial. To resist the tribal impulse that says everyone who disagrees with you is either stupid or evil.",
          "Jesus identified Himself as the truth -- a singular, absolute claim, and one that should be held absolutely. But the way Jesus embodied truth was not tribal. He did not shout down His opponents. He asked questions. He told stories. He ate with people the religious establishment had written off. He held truth with a quiet, unshakable authority that did not need to dominate in order to be real.",
          "Romans 12:2 gives the formation instruction: do not conform. The Greek word is suschematizo, which means to be pressed into a mold from the outside. The world has a shape it wants to press you into, and it does not need your conscious agreement -- only your passive consumption. The antidote is not more information. It is the renewal of your mind, which is a slow, daily, Spirit-led process of learning to see reality through the lens of Scripture rather than through the lens of your feed.",
          "Proverbs 23:23 frames truth as something worth purchasing. Buy it and do not sell it. The implication is that truth has a cost, and there will always be pressure to trade it for something cheaper: comfort, belonging, applause, relevance. The belt of truth in a distorted world means refusing the trade -- holding truth even when it makes you unpopular with every side, even when it costs you the easy tribal identity that comes from picking a team and never questioning it."
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
          "The ancient church understood something the modern church has largely forgotten: without examination, every other spiritual practice becomes a performance.",
          "The practice of the Daily Examen, formalized by Ignatius of Loyola in the sixteenth century, was considered so important that Ignatius told his followers that if they could only do one spiritual practice in a day, this should be the one. Not prayer. Not Scripture reading. The Examen. Because you can read Scripture and miss what it is saying to you. You can pray and never actually tell God the truth. You can attend church and remain completely unknown. But honest self-examination is the one practice that will not let you stay the same.",
          "The Examen is simple. It is a nightly review of the day through two lenses: consolation and desolation. Where did I feel alive, connected, present to God today? That is consolation. Where did I feel drained, distant, pulled away from truth? That is desolation. The practice is not about guilt. It is about awareness. You are learning to see the patterns of your own formation, to notice where truth is gaining ground and where deception is still operating.",
          "Over time, the Examen becomes a mirror -- the kind James describes: the mirror of God's word that shows you who you actually are. And the person who looks into that mirror and does not walk away unchanged is the person who is being formed.",
          "Over the past five days, you have been practicing honesty in layers: honesty about where you are, honesty about the lies you tell yourself, honesty with God, honesty with others, and honesty about what is forming your mind. Today you build the structure that holds all of it together as a weekly rhythm, not a one-time commitment.",
          "That is what the belt of truth looks like as a sustainable practice: a nightly return to the truth about your day, your heart, and your God. The discipline that keeps every other piece of the armor honest."
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

  "breastplate-of-righteousness": {
    num: "02",
    title: "Breastplate of Righteousness",
    icon: "/Breastplate_white_icon.png",
    trackTitle: "Already Clothed",
    img: "/Breastplate_Hero_wide.png",
    cumulative: "Morning declaration (3–5 identity sentences)",
    days: [
      {
        num: 1,
        title: "The Righteousness That Isn't Yours",
        stillness: "Before you begin, set down the weight of your performance. You do not need to earn what you are about to read. You do not need to be in the right headspace. Come as you are. That is the whole theology of this track.",
        scriptures: [
          { text: "Stand firm then, with the breastplate of righteousness in place.", ref: "Ephesians 6:14" },
          { text: "God made him who had no sin to be sin for us, so that in him we might become the righteousness of God.", ref: "2 Corinthians 5:21" },
          { text: "Not having a righteousness of my own that comes from the law, but that which is through faith in Christ, the righteousness that comes from God on the basis of faith.", ref: "Philippians 3:9" },
        ],
        teaching: [
          "The breastplate covered the chest. In a Roman soldier's armor, it was the piece that protected the heart, the lungs, and everything vital to staying alive on the battlefield. Without it, a single well-placed strike ended the fight. The breastplate was not optional. It was survival.",
          "Paul chose this image for righteousness deliberately. Because righteousness is what protects the most vulnerable part of your spiritual life: your sense of standing before God.",
          "When you hear the word \"righteousness,\" your instinct is almost certainly to think about behavior. Am I doing the right things? Am I living up to the standard? Am I righteous enough? That instinct is understandable. It is also the exact thing the breastplate is designed to protect you from.",
          "Paul is not talking about behavioral righteousness here. He is talking about positional righteousness -- the righteousness that comes from God on the basis of faith. This is the righteousness described in 2 Corinthians 5:21: God made Christ to be sin so that you might become the righteousness of God. The grammar matters. This is something that happened to you, not something you produced.",
          "The breastplate of righteousness is a gift that protects you from the lie that your standing before God depends on your behavior at all.",
          "This does not mean behavior doesn't matter. It does. But behavior flows from identity, not the other way around. You do not obey your way into righteousness. You live from the righteousness you have already been given. The order is everything. Get it backwards and the entire Christian life becomes a performance, an endless audit of whether you are measuring up. Get it right and obedience becomes a response to love rather than a strategy for earning it.",
          "Philippians 3:9 is Paul's personal testimony on this point. He had more behavioral righteousness than almost anyone. Pharisee of Pharisees. Faultless under the law. And he counted it all as loss compared to the righteousness that comes through faith in Christ -- because even his best behavior was not the point. The point was Christ's righteousness, given to him, received by faith.",
          "What you put on when you put on the breastplate is not your track record or your spiritual performance this week. It is Christ's righteousness, credited to you, protecting the most vulnerable thing you carry: your heart."
        ],
        practice: {
          duration: "15 Minutes",
          body: "This practice is diagnostic. Take a journal or a blank page and answer this question as honestly as you can:\n\nWhat am I using to measure my standing before God right now?\n\nNot what you know theologically. What you actually feel. What metric, consciously or not, are you using to determine whether God is pleased with you today?\n\nIt might be your quiet time consistency. Your sin patterns. Your productivity. Your emotional state. Your parenting. Your ministry output. Your ability to hold it together.\n\nWrite it down. Look at it. Then write this sentence underneath: \"This is not the breastplate. The breastplate is Christ's righteousness, not mine.\"\n\nYou do not have to feel it today. You just have to name the difference between what you have been wearing and what has actually been given to you.",
        },
        reflection: "If your standing before God is not based on your performance, what changes about how you approach today?",
        prayer: "God,\n\nI have been measuring myself by the wrong metric.\nI have been treating my standing with you like something I earn and lose based on how well I perform.\n\nThat is not the breastplate. That is the thing the breastplate protects me from.\n\nToday I put on the righteousness that is not mine. The one that comes from you, through faith, by grace.\n\nProtect my heart from the performance engine. Let me live from what has been given, not from what I think I need to earn.\n\nAmen.",
      },
      {
        num: 2,
        title: "The Performance Engine",
        stillness: "You are not here to prove anything. Not to God. Not to yourself. Not to the voice in your head that says you need to try harder. Be still. You are already held.",
        scriptures: [
          { text: "Are you so foolish? After beginning by means of the Spirit, are you now trying to finish by means of the flesh?", ref: "Galatians 3:3" },
          { text: "For it is by grace you have been saved, through faith, and this is not from yourselves, it is the gift of God, not by works, so that no one can boast.", ref: "Ephesians 2:8-9" },
          { text: "Come to me, all you who are weary and burdened, and I will give you rest.", ref: "Matthew 11:28" },
        ],
        teaching: [
          "There is a machine running inside most Christians and they do not even know it is there.",
          "It runs on a simple algorithm: perform well, feel accepted. Perform poorly, feel distant. The inputs change depending on the person. For some, the metric is quiet time consistency. For others, it is moral track record. For others, it is ministry output, relational harmony, or emotional stability. But the underlying logic is always the same: your standing with God is a variable, and your behavior is the input that moves it up or down.",
          "This is the performance engine. And it is relentless.",
          "The engine does not announce itself. It just runs. It runs when you have a good week and feel closer to God, then have a bad week and feel like He has pulled away. It runs when you compare your spiritual life to someone else's and come up short. It runs in the background of almost every Christian's daily experience, quietly producing exhaustion without ever explaining why.",
          "Paul confronted this engine directly in Galatia. The church had begun by the Spirit, by grace, through faith. Then teachers arrived telling them they needed to add works to the equation. Paul's response was not gentle. \"Are you so foolish?\" The sharpness reveals how seriously he took the threat. The performance engine does not just tire you out. It replaces the gospel. It substitutes a transaction for a relationship and calls it faithfulness.",
          "The cultural version of the engine is no less powerful. Modern life runs on metrics. Your worth is your productivity. Your value is your output. Your identity is your achievement. The performance engine inside the church is simply the spiritual mutation of a formation system that already dominates every other area of your life. You are trained from childhood to earn your standing. The gospel says your standing has already been earned by someone else. Those two systems cannot coexist. One will win.",
          "Jesus' invitation in Matthew 11:28 is addressed specifically to the people the engine has worn out. \"Come to me, all you who are weary and burdened.\" The weariness He is describing is not physical tiredness. It is the exhaustion of performance. And His offer is not a new set of performance targets. It is rest. Set down the weight you were never meant to carry. Let someone else's righteousness be your standing.",
          "The breastplate of righteousness is the piece of armor that breaks the engine. Your heart is already protected -- not because you performed well today, but because Christ's righteousness was credited to you by faith. The engine cannot survive contact with that truth. But only if you actually believe it, not just doctrinally, but in the way you talk to yourself at the end of a bad day. In the way you approach God after you fail. In the way you measure whether you are enough."
        ],
        practice: {
          duration: "15 Minutes",
          body: "Today's practice is about catching the engine in real time.\n\nSet three alarms on your phone: one for mid-morning, one for early afternoon, one for evening. Label each one: \"What am I performing right now?\"\n\nWhen each alarm goes off, pause for sixty seconds and ask: In this moment, am I living from acceptance or for acceptance? Am I trying to earn something that has already been given?\n\nAt the end of the day, write down what you noticed. Where did the engine show up? What triggered it? What would it look like to shut it off in that moment and rest in what has already been given?",
        },
        reflection: "Where is the performance engine running hardest in your life right now, and what would it take to let it stop?",
        prayer: "God,\n\nI am tired.\nNot because I have worked too hard, but because I have been carrying a weight you never asked me to carry.\n\nI have been trying to earn what you already gave.\nI have been performing for an audience of One who never asked for a performance.\n\nBreak the engine. Teach me to live from your acceptance instead of for it.\n\nI come to you weary. Give me rest.\n\nAmen.",
      },
      {
        num: 3,
        title: "The Breastplate Against Shame",
        stillness: "Today's content touches something deep. Shame does not respond well to speed. Slow down. You are safe here. What you read today is not an accusation. It is a rescue.",
        scriptures: [
          { text: "Therefore, there is now no condemnation for those who are in Christ Jesus.", ref: "Romans 8:1" },
          { text: "Instead of your shame you will receive a double portion, and instead of disgrace you will rejoice in your inheritance.", ref: "Isaiah 61:7" },
          { text: "I delight greatly in the Lord; my soul rejoices in my God. For he has clothed me with garments of salvation and arrayed me in a robe of righteousness.", ref: "Isaiah 61:10" },
        ],
        teaching: [
          "Shame is the enemy's most precise weapon against the human heart. It does not attack your behavior. It attacks your identity.",
          "The difference matters. Guilt says, \"I did something wrong.\" Shame says, \"I am something wrong.\" Guilt can be productive -- it leads to repentance, confession, and change. Shame is never productive. It leads to hiding, isolation, and the slow erosion of your ability to believe that God could actually want you.",
          "The breastplate of righteousness is God's answer to shame. Guilt is resolved through confession and forgiveness, and the Bible has clear pathways for both. Shame operates at a deeper level. Shame does not say, \"You need forgiveness.\" It says, \"You are beyond forgiveness. You are disqualified. You are too far gone. If people really knew you, they would leave.\"",
          "That is not conviction. That is a lie.",
          "Romans 8:1 is one of the most important sentences in the entire Bible precisely because it addresses this lie directly. There is now no condemnation for those who are in Christ Jesus. No condemnation. The verdict has been rendered, and it is not guilty. Not because you are innocent, but because the penalty has been absorbed by someone else.",
          "Shame cannot survive contact with that truth. But it tries. And it often succeeds -- not because the truth is insufficient, but because shame operates at the level of feeling, and most people have never learned to bring their feelings under the authority of what is true.",
          "This is what the breastplate does. It positions the truth of your righteousness in Christ between your heart and the attack. When shame says, \"You are disqualified,\" the breastplate says, \"There is no condemnation.\" When shame says, \"If they knew the real you,\" the breastplate says, \"God knows the real you, and He has clothed you in righteousness.\" When shame says, \"You will never be enough,\" the breastplate says, \"You were never supposed to be. That is the whole point of grace.\"",
          "Isaiah 61:10 is the imagery that holds it together. God has clothed you -- not instructed you to clothe yourself, not given you a pattern and told you to sew, but dressed you in salvation and righteousness as a gift. The breastplate is already on. You did not forge it. You do not maintain it. You receive it and wear it.",
          "The daily work is not building the breastplate. It is believing it is there when shame tells you it is not."
        ],
        practice: {
          duration: "15 Minutes",
          body: "Shame thrives in darkness. It loses power when it is named.\n\nTake your journal. Write down one thing you carry shame about. Not guilt. Shame. The thing that makes you feel fundamentally disqualified, not just morally wrong but personally defective.\n\nNow write Romans 8:1 directly underneath it. \"There is now no condemnation for those who are in Christ Jesus.\"\n\nRead both statements out loud. The shame and the truth. Let them exist on the same page. This is not a magic formula. It is a discipline. You are training yourself to bring the feeling of shame under the authority of what God has declared.\n\nIf you did the practice on Day 4 of the Belt of Truth track, where you had an honest conversation with someone, consider sharing this with that same person. Shame hates a witness.",
        },
        reflection: "What would your life look like if you actually believed that no condemnation means no condemnation?",
        prayer: "God,\n\nI have been carrying shame that does not belong to me.\nIt has been telling me I am disqualified, and I have been believing it.\n\nToday I put on the breastplate. Not my righteousness. Yours.\nNot my track record. Christ's.\n\nNo condemnation. I am going to keep saying it until I believe it.\nNo condemnation. No condemnation.\n\nClothe me. Protect my heart. I cannot do this for myself.\n\nAmen.",
      },
      {
        num: 4,
        title: "The Breastplate Against Pride",
        stillness: "Yesterday was about shame. Today is about its mirror image. Both attack identity. Both distort how you see yourself before God. Be open. This may be less comfortable than you expect.",
        scriptures: [
          { text: "For by the grace given me I say to every one of you: Do not think of yourself more highly than you ought, but rather think of yourself with sober judgment, in accordance with the faith God has distributed to each of you.", ref: "Romans 12:3" },
          { text: "God opposes the proud but shows favor to the humble.", ref: "James 4:6" },
          { text: "What do you have that you did not receive? And if you did receive it, why do you boast as though you did not?", ref: "1 Corinthians 4:7" },
        ],
        teaching: [
          "Most teaching on the breastplate of righteousness focuses on shame. And rightly so. Shame is pervasive, destructive, and deeply misunderstood. But the breastplate protects against pride too. And pride is the harder conversation, because shame is something you feel, while pride is something you rarely see in yourself.",
          "The logic is symmetrical. If the breastplate of righteousness means your standing before God is based on Christ's performance rather than yours, then shame has no ground. You cannot be disqualified by your failure because your standing was never based on your success. But the same truth cuts in the other direction. If your standing is not based on your performance, you cannot be elevated by it either. Your best day does not make you more righteous. Your most disciplined season does not put you ahead. Your theological knowledge, your ministry output, your moral consistency -- none of it changes your position. You are clothed in someone else's righteousness. That is both the freedom and the humiliation of the gospel.",
          "Pride in the spiritual life is subtle. It rarely looks like arrogance. More often it looks like comparison. You read about someone else's sin and think, \"At least I'm not there.\" You see someone less disciplined and feel a quiet sense of spiritual superiority. You measure your formation against someone else's and feel good about where you stand. None of this is spoken. Most of it is barely conscious. But it is all rooted in the same lie the performance engine runs on: that your standing is determined by your behavior.",
          "Paul's question in 1 Corinthians 4:7 is devastating in its simplicity. What do you have that you did not receive? The answer, if you are honest, is nothing. Your faith was a gift. Your understanding was a gift. Your ability to obey was empowered by grace. Even your desire to be formed is not something you generated. It was placed in you by the Spirit. So what exactly is there to boast about?",
          "Romans 12:3 says to think of yourself with sober judgment -- not poorly, not inflated, but accurately. And accurate, in the light of the gospel, means this: you are deeply loved, fully forgiven, and completely dependent. All three are true simultaneously. Shame denies the first two. Pride denies the third.",
          "The breastplate protects against both. It holds your heart in the place of sober truth: you are not disqualified, and you are not self-sufficient. You are a recipient. Everything you have was given. And the appropriate response to a gift is not pride. It is gratitude."
        ],
        practice: {
          duration: "15 Minutes",
          body: "This practice requires honesty of a different kind than the shame exercise yesterday.\n\nAsk yourself: Where do I feel spiritually superior? Not in obvious ways. In the quiet, unspoken ways.\n\nIs there a person or group you look down on spiritually, even slightly? A theology you dismiss without engaging? A lifestyle you judge from a distance? A failure in someone else that makes you feel better about yourself?\n\nWrite it down. Be specific. Then write 1 Corinthians 4:7 next to it: \"What do you have that you did not receive?\"\n\nThe goal is not self-flagellation. It is sober judgment. Seeing yourself accurately. You are no better and no worse than any other person standing in Christ's righteousness. The breastplate levels the ground.",
        },
        reflection: "Where has your confidence in your own righteousness quietly replaced your dependence on Christ's?",
        prayer: "God,\n\nI do not like admitting this, but there are places where I have been proud.\nNot loudly. Quietly. In comparisons I make without saying them out loud. In judgments I pass without examining myself first.\n\nI have nothing that I did not receive from you.\nMy faith is a gift. My obedience is empowered by grace. My standing is borrowed.\n\nProtect me from the pride that forgets this.\nKeep me in the place of sober truth: fully loved, fully forgiven, and fully dependent.\n\nAmen.",
      },
      {
        num: 5,
        title: "Living from Acceptance",
        stillness: "You have spent four days dismantling false foundations: performance, shame, pride. Today is about what you build in their place. Take a breath. This is the turn.",
        scriptures: [
          { text: "See what great love the Father has lavished on us, that we should be called children of God! And that is what we are!", ref: "1 John 3:1" },
          { text: "For we are God's handiwork, created in Christ Jesus to do good works, which God prepared in advance for us to do.", ref: "Ephesians 2:10" },
          { text: "I have been crucified with Christ and I no longer live, but Christ lives in me. The life I now live in the body, I live by faith in the Son of God, who loved me and gave himself for me.", ref: "Galatians 2:20" },
        ],
        teaching: [
          "There are two ways to live the Christian life. They look similar from the outside. They produce very different people on the inside.",
          "The first is living for acceptance. This is the performance engine at work. You obey in order to be loved. You serve in order to be valued. You pursue holiness as a strategy for staying in God's good graces, and the motivation underneath every act of faithfulness is the fear that without it, you might not be enough. This mode produces people who are outwardly disciplined and inwardly exhausted. They do the right things for the wrong reasons, and over time, the dissonance between their external obedience and their internal anxiety becomes unbearable.",
          "The second is living from acceptance. The gospel at work. You obey because you are already loved. You serve because your value is already established. You pursue holiness as a response to the standing you have already been given, and the motivation underneath every act of faithfulness is gratitude rather than fear. This mode produces people who are both disciplined and free -- they do the right things because they have been changed by love, and the obedience flows from the change rather than trying to produce it.",
          "The preposition changes everything. For versus from. The external behavior can look identical. The internal posture is completely different.",
          "1 John 3:1 is the foundation for the second way of living. See what great love the Father has lavished on us. The word \"lavished\" is excessive on purpose. This is not measured love, not proportional love, not love contingent on your response. It is lavished -- poured out without calculation. And the result is not that you might become a child of God if you perform well enough. The result is that you are called a child of God, and that is what you are. Present tense. Already true. Settled.",
          "Ephesians 2:10 adds the crucial second movement. You are God's handiwork, created in Christ Jesus to do good works. The order matters. You are created first. The identity comes before the action. The good works were prepared in advance -- they are not your audition. They are your assignment, given to someone whose identity is already secure.",
          "This is the reorientation the breastplate makes possible. When your standing is protected by Christ's righteousness rather than your own, you are free to obey without anxiety. Free to fail without despair. Free to serve without needing the service to validate your worth. The pressure is off -- not the calling, but the pressure. You still do the work. You just do it from a completely different place."
        ],
        practice: {
          duration: "15 Minutes",
          body: "Today's practice is about rewiring the internal narrative.\n\nThink of one area of your life where you have been living for acceptance rather than from it. A relationship where you perform to be valued. A ministry where your identity is tied to the output. A discipline you maintain out of fear rather than love.\n\nWrite it down. Then rewrite the narrative underneath it.\n\nThe old narrative might sound like: \"If I don't keep up my quiet time streak, God will be disappointed in me.\"\n\nThe new narrative sounds like: \"I am already fully accepted. I spend time with God because I am His child, not because I need to earn my place.\"\n\nSpeak the new narrative out loud. Not because saying it makes it true. It is already true. But because your voice has power to retrain your mind. You have been rehearsing the wrong narrative for years. It will take repetition to replace it.",
        },
        reflection: "What would change in your daily life if you truly believed your acceptance was already settled?",
        prayer: "God,\n\nI want to live from your acceptance, not for it.\nI have spent so long performing that I am not sure I know how to stop.\n\nRetrain me. Rewire the way I think about your love.\nHelp me believe that your acceptance is not a variable. It is settled. It is lavished. It is mine.\n\nLet my obedience flow from gratitude, not fear.\nLet my rest be real, not earned.\n\nI am your child. That is what I am.\n\nAmen.",
      },
      {
        num: 6,
        title: "The Morning Declaration",
        stillness: "This is the last day of this track. What you build today is designed to outlast this week. Do not rush. You are building a practice that will protect your heart long after this track is finished.",
        scriptures: [
          { text: "I will praise you, Lord, with all my heart; before the 'gods' I will sing your praise.", ref: "Psalm 138:1" },
          { text: "Through Jesus, therefore, let us continually offer to God a sacrifice of praise, the fruit of lips that openly profess his name.", ref: "Hebrews 13:15" },
          { text: "The tongue has the power of life and death.", ref: "Proverbs 18:21" },
        ],
        teaching: [
          "The ancient church understood something about the relationship between the mouth and the mind that the modern church has largely lost. They practiced daily offices: fixed-hour prayers spoken aloud at set times throughout the day. They recited creeds, not because they needed to be reminded of what they believed, but because the act of speaking truth aloud shaped the speaker. The words formed the person who said them.",
          "This is not magic. It is neuroscience dressed in ancient clothing. The brain processes spoken words differently than thought words. When you speak something aloud, you engage auditory processing, motor function, and memory consolidation simultaneously. You are not just thinking the truth. You are hearing yourself declare it. Over time, the declaration reshapes the neural pathways that govern your default self-perception. What you say to yourself, out loud, repeatedly, becomes the script your mind runs on.",
          "This is why shame is so powerful. It has been running an internal script for years, often decades. \"You are not enough. You are too far gone. If they really knew you.\" That script plays on a loop so familiar that you no longer recognize it as a script. It just feels like reality.",
          "The morning declaration is the counter-script. And it is not borrowed from self-help or affirmation culture -- it is the deliberate, daily act of speaking what God has declared over your life before the world has a chance to speak its version. It is putting on the breastplate before you leave the house.",
          "Proverbs 18:21 says the tongue has the power of life and death. This applies to how you speak to others. It applies with equal force to how you speak to yourself. The first voice you hear in the morning will set the trajectory of your day. If that voice is shame, you will spend the day performing. If that voice is the performance engine, you will spend the day measuring. If that voice is the truth of your identity in Christ, you will spend the day free.",
          "This is a daily discipline, not a one-time exercise. The morning declaration is the breastplate's daily application: before the inbox, before the mirror, before the metric, you speak the truth about who you are and whose you are. Not because you feel it. Because it is true."
        ],
        practice: {
          duration: "20 Minutes",
          body: "Today you build your morning declaration. This is your cumulative artifact for this track, the practice you will carry forward daily.\n\nWrite three to five sentences that declare the truth of your identity in Christ. Draw from what God has shown you over the past five days. These sentences should be personal, specific, and rooted in Scripture.\n\nHere are examples to start from. Adapt them or write your own:\n\nMy standing before God is not based on my performance. I am clothed in the righteousness of Christ.\n\nThere is no condemnation for me. Not because I am innocent, but because the penalty has been absorbed.\n\nI have nothing that I did not receive. My faith, my obedience, and my desire for God are all gifts of grace.\n\nI am God's child. That is what I am. My acceptance is settled, not variable.\n\nI live from love, not for love. My obedience is a response to grace, not a strategy for earning it.\n\nWrite your declaration on a card, in your phone, or in your journal. Place it where you will see it first thing in the morning. Then commit to speaking it aloud every morning for the next thirty days.\n\nTomorrow morning is the first day. Before email. Before news. Before the mirror. Speak the truth over yourself before the world speaks its version.\n\nTell one person what you have written and what you have committed to. Not for accountability as performance. For accountability as love.",
        },
        reflection: "What has God shown you about righteousness this week that you do not want to forget?",
        prayer: "God,\n\nThank you for six days of learning to rest in what you have already done.\n\nI have been performing, measuring, carrying shame, and comparing myself to others for longer than I can remember. This week you showed me that none of that is the breastplate. The breastplate is your righteousness, not mine.\n\nHelp me speak the truth over myself every morning. Not because speaking makes it true, but because I need to hear it until I believe it.\n\nAlready clothed. Already accepted. Already yours.\n\nProtect my heart, Lord. I cannot protect it myself.\n\nAmen.",
      },
    ],
  },
  "gospel-of-peace": {
    num: "03",
    title: "Gospel of Peace",
    icon: "/Sandal_white_icon.png",
    trackTitle: "Ground Beneath You",
    img: "/Gospel of Peace_Hero_wide.png",
    cumulative: "Peace Pause rhythm (3 daily anchoring statements)",
    days: [
      {
        num: 1,
        title: "Peace as Grounding",
        stillness: "Place your feet flat on the floor. Feel the ground beneath you. Before you read, before you think, before you plan: you are held. The ground does not move. Neither does the one who put it there.",
        scriptures: [
          { text: "And with your feet fitted with the readiness that comes from the gospel of peace.", ref: "Ephesians 6:15" },
          { text: "Peace I leave with you; my peace I give you. I do not give to you as the world gives. Do not let your hearts be troubled and do not be afraid.", ref: "John 14:27" },
          { text: "You will keep in perfect peace those whose minds are steadfast, because they trust in you.", ref: "Isaiah 26:3" },
        ],
        teaching: [
          "The Roman soldier's footwear was called the caliga, a heavy sandal fitted with hobnails on the sole. It was not designed for comfort. It was designed for grip. The nails dug into the ground, anchoring the soldier so that when the force of battle pressed against him, he did not slide. He could absorb the impact because his feet held firm.",
          "Peace, in Paul's framing, is a position. A place to stand.",
          "This distinction matters, because the modern world has redefined peace as the absence of conflict -- the feeling you get when everything is calm, the vacation, the quiet morning, the moment when nothing is going wrong. That version of peace is temporary and circumstantial. It depends entirely on your environment cooperating with your preferences.",
          "The peace Paul describes is something else entirely. It is the readiness that comes from the gospel. The word \"readiness\" is the Greek hetoimasia, which means a prepared foundation, a firm footing. The gospel of peace does not remove the conflict. It gives you a place to stand inside it.",
          "This is the peace Jesus promised in John 14:27. \"My peace I give you. I do not give to you as the world gives.\" The world gives peace by removing problems. Jesus gives peace by anchoring identity. The world says peace is possible when everything works out. Jesus says peace is possible because the outcome is already secured, regardless of what happens between now and then.",
          "Isaiah 26:3 names the mechanism: steadfast trust. Perfect peace -- the Hebrew shalom shalom -- does not come from perfect circumstances. It comes from a mind that is fixed on God rather than fixed on the variables. The anxious mind scans the horizon for threats. The peaceful mind has already settled the question of who is in control.",
          "The shoes of peace are not about feeling calm. They are about being grounded. You will still feel anxious -- the shoes do not eliminate the feeling. They give you a place to stand when the feeling comes. The difference between being knocked over by the wave and being anchored to the rock underneath it."
        ],
        practice: {
          duration: "15 Minutes",
          body: "Find a quiet place. Sit with your feet flat on the floor.\n\nAsk yourself this question: What am I most anxious about right now? Do not spiritualize the answer. Name the real thing. The finances. The relationship. The diagnosis. The decision. The thing that keeps your mind spinning when you try to sleep.\n\nWrite it down. Then write this underneath: \"The outcome of my story is already secured. This situation is real, but it is not ultimate. God holds what I cannot control.\"\n\nNow sit in silence for five minutes. Not to solve the problem. Not to pray it away. Just to practice standing on the ground the gospel provides. Feet on the floor. Breath in your lungs. The ground holds.",
        },
        reflection: "What are you anxious about right now, and what would it feel like to set it down? Not because it doesn't matter, but because it isn't yours to carry.",
        prayer: "God,\n\nI am anxious. I do not want to pretend otherwise.\nThere are things pressing against me that I cannot control, and my instinct is to grip tighter, plan harder, and spin faster.\n\nTeach me to stand.\nNot to fix. Not to control. Not to figure out. To stand.\n\nYou have already secured the outcome. Help me trust you with the middle.\n\nGround my feet in your peace.\n\nAmen.",
      },
      {
        num: 2,
        title: "Anxiety as a Formation System",
        stillness: "You are here again. That matters. The fact that you returned to this practice is itself a small act of peace. Slow down. Be present to what is in front of you.",
        scriptures: [
          { text: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.", ref: "Philippians 4:6-7" },
          { text: "Who of you by worrying can add a single hour to your life?", ref: "Matthew 6:27" },
          { text: "Cast all your anxiety on him because he cares for you.", ref: "1 Peter 5:7" },
        ],
        teaching: [
          "Anxiety is not just a feeling. It is a formation system.",
          "Consider what anxiety does to you over time. It trains you to scan the horizon for threats. It teaches you to rehearse worst-case scenarios as a form of preparation. It conditions you to believe that the future is hostile and that your only defense is hypervigilance. Over months and years, anxiety reshapes your default posture from trust to control, from presence to projection, from rest to restlessness.",
          "The world you live in is engineered to amplify this. The news cycle operates on urgency. Social media operates on comparison. The economy operates on scarcity. Every system you interact with daily has a financial incentive to keep you unsettled, because unsettled people consume more: more news, more products, more content, more reassurance. Calm people are bad for business.",
          "This is a design pattern, not a conspiracy theory. Name it or it will form you.",
          "Paul's instruction in Philippians 4:6 is not a guilt trip about worrying. \"Do not be anxious about anything\" is not a command to feel differently. It is an instruction to act differently. The alternative to anxiety is not calm feelings. It is a practice: prayer, petition, thanksgiving. When anxiety comes, you do not suppress it. You redirect it. You bring the specific thing to God. You name it. You ask. And then you give thanks -- not because the situation has changed, but because you are releasing it to someone who can actually hold it.",
          "The result, Paul says, is a peace that transcends understanding. The Greek word is huperecho, which means to surpass or rise above. This peace does not make sense. It is not the logical result of your circumstances improving. It is a peace that exists in spite of the circumstances, because its source is not the situation. Its source is the person you handed the situation to.",
          "Jesus' question in Matthew 6:27 is rhetorical but devastating. Who of you by worrying can add a single hour to your life? Worry produces nothing. It feels productive. It feels like preparation. But it adds nothing -- it only subtracts: presence, sleep, joy, attention, the capacity to be with the people in front of you.",
          "The shoes of peace are the daily refusal to let anxiety be your formation system. You will feel anxious. The question is whether you will let the feeling form you, or whether you will bring it to God and let His peace form you instead."
        ],
        practice: {
          duration: "15 Minutes",
          body: "Today's practice is a written exercise in casting.\n\nTake a blank page. Draw a line down the middle. On the left side, write \"What I am carrying.\" On the right side, write \"What I am casting.\"\n\nOn the left, list everything you are currently anxious about. Be specific. Do not generalize (\"everything\") or spiritualize (\"just trusting God\"). Name the actual concerns.\n\nThen, one by one, move each item to the right column. As you write it on the right side, speak this out loud: \"I am casting this to God because He cares for me.\"\n\nYou are not solving the problems. You are physically, visibly, verbally transferring them from your hands to God's. The act of writing and speaking it is the practice. Keep the page. Look at it tomorrow. Notice what your heart does when you see the things you cast.",
        },
        reflection: "What would change about your day if you refused to let anxiety be the loudest voice in your head?",
        prayer: "God,\n\nI am giving you what I have been carrying.\nNot because I have figured out how to stop worrying. Because you told me to cast it, and I am choosing to obey.\n\nHere it is. All of it. The things that keep me up. The things I rehearse. The things I cannot control.\n\nGuard my heart. Guard my mind.\nGive me the peace that does not make sense.\n\nAmen.",
      },
      {
        num: 3,
        title: "The Peace of Settled Outcomes",
        stillness: "The story has already been written. The ending is not in question. Sit with that for a moment before you read anything else.",
        scriptures: [
          { text: "I have told you these things, so that in me you may have peace. In this world you will have trouble. But take heart! I have overcome the world.", ref: "John 16:33" },
          { text: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.", ref: "Romans 8:28" },
          { text: "For I am convinced that neither death nor life, neither angels nor demons, neither the present nor the future, nor any powers, neither height nor depth, nor anything else in all creation, will be able to separate us from the love of God that is in Christ Jesus our Lord.", ref: "Romans 8:38-39" },
        ],
        teaching: [
          "The deepest peace available to a human being is not the peace of solved problems. It is the peace of settled outcomes.",
          "Jesus says it plainly in John 16:33. In this world you will have trouble. That is not a warning about a possible future. It is a statement of guaranteed reality. Trouble is coming. It is already here. The question has never been whether you will face difficulty -- the question is whether difficulty has the final word.",
          "Jesus' answer: it does not. \"I have overcome the world.\" Past tense. Already accomplished. The outcome of the cosmic story is not in doubt. Evil does not win. Death does not win. The powers that press against you, whether personal or systemic, cultural or spiritual, have already been defeated. Not in your experience yet, but in reality. And faith is the decision to live from reality rather than from experience.",
          "Every other kind of peace on offer misses this. Stoic peace lowers your expectations so you cannot be disappointed. Therapeutic peace teaches you to manage your anxiety with the right techniques. Cultural peace bets on arranging your life so that nothing goes wrong. Gospel peace says everything may go wrong, and you are still held. The outcome is secured. Nothing can separate you from the love of God.",
          "Romans 8:38-39 is the most comprehensive security statement in all of Scripture. Paul does not say \"most things\" cannot separate you. He says nothing. Neither death nor life. Neither present nor future. Neither height nor depth. Nor anything else in all creation. He is systematically eliminating every possible category of threat and declaring: none of them can reach you. Not because you are strong enough to withstand them. Because God's love is strong enough to hold you through them.",
          "The peace of settled outcomes does not mean you will not grieve. It does not mean you will feel peaceful every day. It means that underneath every struggle, underneath every grief, underneath every day when the feelings do not cooperate, there is a foundation that does not move. The outcome of your story is not determined by your circumstances. It is determined by the love of God in Christ Jesus. And that love is not going anywhere.",
          "The shoes of peace are what let you stand on that foundation even when the ground above it shakes."
        ],
        practice: {
          duration: "15 Minutes",
          body: "Today's practice is about anchoring yourself in settled truth.\n\nWrite Romans 8:38-39 out by hand. Not typed. Written. Slowly. Let the words register as you form each one.\n\nWhen you finish, sit with what you wrote. Then ask: What is the thing in my life right now that feels most unsettled? The situation where the outcome feels most uncertain?\n\nUnderneath the passage, write a single sentence: \"[The specific situation] does not have the final word. Nothing can separate me from the love of God.\"\n\nThis is not denial. The situation is real. But it is not ultimate. The practice is learning to hold both truths at the same time: the trouble is real, and the outcome is settled.",
        },
        reflection: "What would change about how you face today if you truly believed the outcome was already secured?",
        prayer: "God,\n\nI believe you have overcome the world.\nI do not always feel like it. But I believe it.\n\nHelp me live from the settled outcome, not from the unsettled middle.\nWhen the ground shakes, remind me of the foundation underneath.\n\nNothing can separate me from your love. Not what I am facing now. Not what is coming next. Nothing.\n\nLet that truth be the ground I stand on today.\n\nAmen.",
      },
      {
        num: 4,
        title: "Peace in Conflict",
        stillness: "Peace is not the absence of conflict. If it were, Jesus would not have had any. Take a breath. Today's content is about standing firm in the middle of tension without losing your footing.",
        scriptures: [
          { text: "If it is possible, as far as it depends on you, live at peace with everyone.", ref: "Romans 12:18" },
          { text: "Blessed are the peacemakers, for they will be called children of God.", ref: "Matthew 5:9" },
          { text: "A gentle answer turns away wrath, but a harsh word stirs up anger.", ref: "Proverbs 15:1" },
        ],
        teaching: [
          "There is a version of peace that is actually avoidance dressed in spiritual language.",
          "It looks like this: conflict arises, and instead of engaging it honestly, you withdraw. You say, \"I'm just keeping the peace.\" You let the issue sit unresolved. You smile through the tension. You absorb the hurt rather than name it. What you call peace is fear wearing a spiritual mask.",
          "True peace, the kind Jesus modeled, is one of the most active postures a person can take. Jesus confronted the Pharisees. He overturned tables in the temple. He told Peter, \"Get behind me, Satan.\" He was direct, honest, and unflinching in the face of conflict. And He was the Prince of Peace. Those two realities do not contradict each other. They define each other. Peace is not the avoidance of truth. It is the delivery of truth from a grounded, non-reactive, love-driven posture.",
          "Romans 12:18 contains two qualifiers that most people skip over: \"if it is possible\" and \"as far as it depends on you.\" Paul is acknowledging that peace is not always achievable by your effort alone. But as far as it depends on you, your posture should be one of peacemaking, not peacekeeping. Peacekeeping maintains the status quo. Peacemaking pursues wholeness, even when the pursuit is uncomfortable.",
          "A peacekeeper avoids the hard conversation. A peacemaker has it -- with gentleness, with truth, and with the willingness to absorb the cost of honesty.",
          "Proverbs 15:1 gives the practical mechanism. A gentle answer turns away wrath. Gentle does not mean weak. It means controlled. It means the response is chosen rather than reactive. It means you have enough internal grounding that you do not need to match the other person's intensity. You can speak the truth without shouting it, hold your position without escalating, and remain present without withdrawing.",
          "This is what the shoes of peace make possible. They do not remove you from conflict. They anchor you inside it. You can stand in a difficult conversation without losing your footing, because your identity is not at stake. Your security is not threatened. The ground beneath you holds. And from that ground, you can speak truth, extend grace, and pursue wholeness rather than just comfort."
        ],
        practice: {
          duration: "15 Minutes",
          body: "Think of one unresolved conflict in your life. It might be a tension with a spouse, a friend, a colleague, or a family member. Something you have been managing rather than addressing.\n\nWrite down the core issue in one sentence. Not the history. Not the full story. The core issue.\n\nThen write two possible responses:\n\nThe peacekeeping response: what you have been doing, which is most likely some form of avoidance, accommodation, or silent resentment.\n\nThe peacemaking response: what it would look like to engage the issue honestly, gently, and from a grounded posture. What would you say? When would you say it? What would you need to believe about your own security in order to take that step?\n\nYou do not have to act today. But you do have to see the difference between the two responses. And if you are ready, choose a time this week to take the peacemaking step.",
        },
        reflection: "Where in your life have you been calling avoidance \"peace\"?",
        prayer: "God,\n\nI have been avoiding conflict and calling it peace.\nI have been managing tension rather than pursuing wholeness.\n\nGive me the grounding to enter the hard conversations.\nNot reactive. Not withdrawn. Gentle and honest and present.\n\nHelp me be a peacemaker, not a peacekeeper.\nAnchor my feet so I can stand in the tension without being moved.\n\nAmen.",
      },
      {
        num: 5,
        title: "Peace and Sabbath",
        stillness: "Today is about the deepest expression of peace: trust. Not trust as a feeling, but trust as a decision. The decision to stop. Be here. Let the stopping teach you something.",
        scriptures: [
          { text: "Remember the Sabbath day by keeping it holy. Six days you shall labor and do all your work, but the seventh day is a sabbath to the Lord your God.", ref: "Exodus 20:8-10" },
          { text: "Come to me, all you who are weary and burdened, and I will give you rest. Take my yoke upon you and learn from me, for I am gentle and humble in heart, and you will find rest for your souls.", ref: "Matthew 11:28-29" },
          { text: "There remains, then, a Sabbath-rest for the people of God; for anyone who enters God's rest also rests from their works, just as God did from his.", ref: "Hebrews 4:9-10" },
        ],
        teaching: [
          "Sabbath is the most counter-cultural thing a Christian can practice. It is also the purest expression of the gospel of peace.",
          "Consider what Sabbath requires. It requires you to stop producing. To stop earning. To stop solving. To stop optimizing. To look at your to-do list, your inbox, your obligations, your ambitions, and to say: \"Not today. Today I trust that God is God and I am not. Today the world continues without my effort, and that is fine.\"",
          "That is an act of radical trust. In a culture that ties identity to productivity, it is one of the most defiant things you can do.",
          "The Sabbath command in Exodus 20 is not primarily about rest for your body, although your body needs it. It encodes a theological truth into the structure of your week: you are not the one holding the world together. God is. And one day out of seven, you are invited to prove you believe that by stopping.",
          "The Israelites learned this lesson the hard way. In the wilderness, God provided manna every morning -- but on the sixth day, He provided double, so they could rest on the seventh. The test was not whether they could gather enough. The test was whether they would trust that what God provided was sufficient. Some gathered on the Sabbath anyway. They could not stop. The addiction to self-sufficiency was too strong.",
          "That addiction is alive and well. The modern Sabbath violation is not going to the office on Sunday. It is the inability to put down the phone. To stop checking email. To sit in a room without producing something. To let an afternoon pass without optimizing it. The violation is not a broken rule. It is a broken trust. A life that cannot stop is a life that does not believe God is in control.",
          "Hebrews 4 frames Sabbath-rest as something that \"remains\" for the people of God. It is available. It is waiting. But you have to enter it, and entering it requires resting from your works just as God rested from His. God's rest after creation was not exhaustion. It was satisfaction. He looked at what He had made and called it good. Sabbath invites you into that same posture: to look at what God has done, to call it sufficient, and to stop.",
          "The shoes of peace and the practice of Sabbath are deeply connected. Both are about grounding yourself in the truth that the outcome does not depend on your effort. Both require trust. Both are practices, not feelings. You do not feel your way into Sabbath. You decide your way into it. And over time, the practice forms you into a person who is less anxious, less driven, and more present -- because one day a week, you practice the truth the gospel declares every day: God is in control, and you are free."
        ],
        practice: {
          duration: "15 Minutes",
          body: "This practice has two parts.\n\nPart one (now): Look at your calendar for the next seven days. Identify one 4-hour block that you will protect as Sabbath. Not a full day if that feels impossible right now. Just four hours. Block it. Protect it. Tell someone about it.\n\nDuring those four hours: no email, no work, no productivity, no optimization. Rest. Walk. Eat a meal slowly. Read something that is not useful. Sit outside. Be present to the people around you. Let the hours pass without earning anything from them.\n\nPart two (after your Sabbath block): Write one sentence about what you noticed. What did it feel like to stop? What was hard? What was freeing? Keep the sentence. It will remind you why Sabbath matters when the next week presses in.",
        },
        reflection: "What would it take for you to trust God enough to stop for one day?",
        prayer: "God,\n\nI do not know how to stop.\nMy identity is so tangled up in my productivity that rest feels irresponsible.\n\nTeach me to trust you enough to put it down.\nNot because the work doesn't matter, but because you are the one who holds the outcomes.\n\nGive me the courage to practice Sabbath. To prove with my time that I believe you are in control.\n\nI want to enter your rest. Show me how.\n\nAmen.",
      },
      {
        num: 6,
        title: "The Peace Pause",
        stillness: "This is the final day of this track. What you build today is a daily rhythm that anchors you in the peace you have been learning about all week. Receive it slowly.",
        scriptures: [
          { text: "Be still, and know that I am God.", ref: "Psalm 46:10" },
          { text: "The Lord is near. Do not be anxious about anything.", ref: "Philippians 4:5-6" },
          { text: "In returning and rest you shall be saved; in quietness and in trust shall be your strength.", ref: "Isaiah 30:15" },
        ],
        teaching: [
          "The shoes of peace require daily return.",
          "This is the practical reality of formation. The truth you absorbed on Day 1 of this track -- that peace is a grounded position, not a feeling -- does not stay at the front of your mind automatically. By mid-morning, the emails have come, the demands have escalated, and the anxiety has returned. By afternoon, you have forgotten the settled outcome. By evening, the ground beneath you feels less steady than it did at dawn.",
          "This is normal. It is also why the ancient church did not pray once a day. They prayed at fixed hours: morning, midday, evening, and sometimes more. Not because God required it, but because they understood that the human mind drifts -- constantly, relentlessly. The fixed-hour prayer was a rhythmic recall, a structured return to the truth that the unstructured mind would otherwise forget.",
          "The Peace Pause is the Counter Formation adaptation of this ancient practice. Simple: three times a day, you stop. Sixty seconds. Feet on the ground. One breath. One truth.",
          "Morning: before the day begins. \"The outcome is already secured. I do not need to be anxious about what is ahead.\"",
          "Midday: when the pace has picked up. \"The Lord is near. I return to the ground beneath me. I stand in peace, not in productivity.\"",
          "Evening: when the day is winding down. \"I release what I carried today. I did not hold the world together. God did. I can rest.\"",
          "The pause is not prayer in the formal sense, although it can become that. It is a reset. A return. A deliberate re-grounding in the peace the gospel provides. Over time, the three daily pauses become as natural as breathing, and the cumulative effect is a person who is less reactive, more present, and more deeply grounded than the person who never stops to remember where they stand.",
          "Isaiah 30:15 names the paradox: in returning and rest you shall be saved. In quietness and in trust shall be your strength. The world says strength is found in effort. The gospel says strength is found in return -- the daily, repeated act of coming back to the truth you keep forgetting. That is what the Peace Pause is. Not a productivity technique. A way home."
        ],
        practice: {
          duration: "20 Minutes",
          body: "Today you build your Peace Pause rhythm. This is your cumulative artifact for this track.\n\nWrite three anchoring statements, one for each pause. These should be short enough to memorize, personal enough to mean something, and rooted in the truths you have encountered this week.\n\nHere are examples. Adapt them or write your own:\n\nMorning: \"The outcome of my story is already secured. I do not need to control today. I stand in peace.\"\n\nMidday: \"The Lord is near. I return to the ground. I release what I am gripping.\"\n\nEvening: \"I did not hold the world together today. God did. I can rest.\"\n\nWrite your three statements. Set three daily alarms on your phone: one for morning (before the day starts), one for midday, one for evening. Label them \"Peace Pause.\"\n\nWhen the alarm sounds, stop for sixty seconds. Speak the statement. Place your feet flat on the ground. Breathe. Return to the truth. Then continue.\n\nDo this every day for the next thirty days. Tell one person what you are practicing and why.",
        },
        reflection: "What has God shown you about peace this week that you do not want to forget?",
        prayer: "God,\n\nThank you for six days of learning to stand.\nNot in my own strength. On your ground.\n\nI have been anxious for a long time. I have been carrying things you never asked me to carry. I have been running at a pace that leaves no room for your peace.\n\nToday I build the rhythm. Three pauses. Three returns. Three moments of remembering that you hold what I cannot.\n\nGround my feet. Settle my heart. Let the peace that passes understanding guard me, all day, every day.\n\nAmen.",
      },
    ],
  },
  "shield-of-faith": {
    num: "04",
    title: "Shield of Faith",
    icon: "/Shield_white_icon.png",
    trackTitle: "Behind What God Has Said",
    img: "/Shield of Faith_Hero_wide.png",
    cumulative: "Arrow log (lies vs. truth document)",
    days: [
      {
        num: 1,
        title: "Faith as a Deliberate Act",
        stillness: "Faith is not a feeling you wait for. It is a position you take. Before you read, take it. Sit down. Open your hands. You are here because you chose to be. That is already faith.",
        scriptures: [
          { text: "In addition to all this, take up the shield of faith, with which you can extinguish all the flaming arrows of the evil one.", ref: "Ephesians 6:16" },
          { text: "Now faith is confidence in what we hope for and assurance about what we do not see.", ref: "Hebrews 11:1" },
          { text: "Without faith it is impossible to please God, because anyone who comes to him must believe that he exists and that he rewards those who earnestly seek him.", ref: "Hebrews 11:6" },
        ],
        teaching: [
          "The Roman thureos was not a small shield. It was a full-body barrier, roughly four feet tall and two and a half feet wide, made of wood, covered in leather, and soaked in water before battle so that flaming arrows would hit the surface and go out. It was not a weapon you wielded with agility. It was a wall you stood behind.",
          "Paul's choice of the thureos is theologically precise. Faith, in the Armor of God, is a large, heavy, deliberate thing that you pick up, plant in front of you, and stand behind. It requires effort. It requires positioning. And it requires the decision to stay behind it when everything in you wants to step out and fight the arrows on your own terms.",
          "Hebrews 11:1 defines faith as confidence in what we hope for and assurance about what we do not see. The Greek word translated \"confidence\" is hupostasis, which means substance, foundation, underlying reality. Faith is the substance of things hoped for. It is the conviction that what God has said is more real than what you can currently see.",
          "This is important because flaming arrows do not feel like lies. They feel like truth. The arrow that says \"God has abandoned you\" does not arrive labeled as a deception. It arrives as a feeling: the silence of unanswered prayer, the persistence of suffering, the gap between what you were promised and what you are experiencing. The arrow feels true. Faith is the decision to stand behind what God has said even when your experience contradicts it.",
          "Hebrews 11:6 adds the element of pursuit. Faith is not passive. The shield is picked up. It is positioned. It is held. These are active verbs. Faith is the most demanding posture in the spiritual life precisely because it requires you to act on what you cannot see, to invest in what you cannot prove, and to stand firm when every feeling tells you to retreat.",
          "The shield does not make the arrows stop. It makes them unable to reach you. The lies will keep coming. The doubt will keep arriving. The feelings of abandonment, inadequacy, and futility will keep firing. The shield extinguishes them. There is a difference between silencing them and extinguishing them. Silencing means you no longer hear them. Extinguishing means they reach you and die. Faith is not the absence of doubt. It is the refusal to let doubt have the final word."
        ],
        practice: {
          duration: "15 Minutes",
          body: "Today is about naming what you are standing behind.\n\nTake a blank page. At the top, write: \"What God has said.\"\n\nBelow it, write three to five statements that God has declared to be true about you, your life, and your future. Not things you hope are true. Things that are in the text. Root each one in Scripture.\n\nFor example: \"God will never leave me or forsake me.\" (Hebrews 13:5) \"Nothing can separate me from God's love.\" (Romans 8:38-39) \"God is working all things for my good.\" (Romans 8:28)\n\nNow turn the page. Write: \"What the arrows say.\"\n\nBelow it, write the lies that most frequently hit. The recurring thoughts, the persistent doubts, the feelings that contradict what God has declared.\n\nLook at both pages. The shield is the first page. The arrows are the second. Your daily work is to stand behind the first when the second is incoming.",
        },
        reflection: "Which arrows hit you most often, and what has God said that directly contradicts them?",
        prayer: "God,\n\nI pick up the shield today. Not because I feel confident. Because you have spoken, and I choose to stand behind what you said.\n\nThe arrows are real. I feel them. But they are not true.\n\nTeach me to hold the shield. Not with strength, but with trust. Help me stay behind it when everything in me wants to step out and fight on my own.\n\nWhat you have said is more real than what I feel.\n\nAmen.",
      },
      {
        num: 2,
        title: "Identifying the Arrows",
        stillness: "The arrows are not random. They have patterns. Today you learn to see them. Slow down. Awareness is the beginning of defense.",
        scriptures: [
          { text: "The thief comes only to steal and kill and destroy; I have come that they may have life, and have it to the full.", ref: "John 10:10" },
          { text: "Be alert and of sober mind. Your enemy the devil prowls around like a roaring lion looking for someone to devour.", ref: "1 Peter 5:8" },
          { text: "We demolish arguments and every pretension that sets itself up against the knowledge of God, and we take captive every thought to make it obedient to Christ.", ref: "2 Corinthians 10:5" },
        ],
        teaching: [
          "Most people do not recognize the arrows when they arrive.",
          "This is the enemy's greatest tactical advantage. A flaming arrow you identify as a flaming arrow can be blocked. But a flaming arrow you mistake for your own thought, your own conclusion, your own accurate assessment of reality? That arrow lands. It lodges. It burns.",
          "The arrows almost always sound like your own voice. \"You're never going to change.\" \"It's too late for you.\" \"God helps other people, not you.\" \"Everyone else has it together.\" \"If they really knew you, they wouldn't stay.\" These thoughts do not announce their origin. They do not arrive labeled as attacks. They sound like observations. They feel like truth. And because you do not recognize them as such, you accept them as your own conclusions and move on -- not realizing you have just internalized a lie that will quietly shape your behavior, your relationships, and your faith for months.",
          "Peter's instruction is military in its precision: be alert and sober-minded. A sentry on watch. The assumption is that something is coming -- and it is. The arrows are not hypothetical. The enemy is active, and his primary weapon is not temptation. It is deception. He wants to steal your peace, kill your faith, and destroy your sense of identity. His method is the lie that sounds like a thought.",
          "Paul's counter-strategy in 2 Corinthians 10:5 is equally precise. Take every thought captive. The metaphor is violent on purpose. You do not politely ask the thought to leave. You capture it. You examine it. You hold it up against the knowledge of God and determine: is this true, or is this an arrow?",
          "This requires a skill most Christians have never been taught: the ability to observe your own thoughts rather than simply believe them. Not every thought that passes through your mind is yours. Not every conclusion your brain reaches is accurate. Not every feeling that arrives is telling the truth. The shield of faith begins with the awareness that you are being fired upon, and that many of the thoughts you have accepted as reality are not reality at all. They are arrows. And they can be caught."
        ],
        practice: {
          duration: "15 Minutes",
          body: "Today you begin building your arrow log.\n\nFor the next 24 hours, pay attention to recurring negative thoughts. The ones that feel like facts but function like attacks. Write them down as they come. Do not edit them. Do not analyze them. Just record them.\n\nAt the end of 24 hours, look at your list. Circle any thought that does one of these things: attacks your identity (who you are), attacks your future (what is possible), attacks God's character (whether He is good or present), or attacks your relationships (whether you are loved or wanted).\n\nThese are the arrows. Tomorrow, you will learn what to do with them. Today, you simply learn to see them.",
        },
        reflection: "What thoughts have you been accepting as truth that might actually be arrows?",
        prayer: "God,\n\nOpen my eyes to the lies I have been living under.\nNot the obvious ones. The quiet ones. The thoughts that sound like my own voice but carry the enemy's message.\n\nGive me the alertness to see the arrows coming.\nGive me the discipline to catch them before they land.\n\nI do not want to be formed by lies anymore. Teach me to see.\n\nAmen.",
      },
      {
        num: 3,
        title: "The Shield in Community",
        stillness: "You were not meant to hold the shield alone. In Paul's letter, every verb is plural. The armor is worn by a body, not an individual. Sit with that. You are not in this fight by yourself.",
        scriptures: [
          { text: "Carry each other's burdens, and in this way you will fulfill the law of Christ.", ref: "Galatians 6:2" },
          { text: "Two are better than one, because they have a good return for their labor: If either of them falls down, one can help the other up. But pity anyone who falls and has no one to help them up.", ref: "Ecclesiastes 4:9-10" },
          { text: "And let us consider how we may spur one another on toward love and good deeds, not giving up meeting together, as some are in the habit of doing, but encouraging one another.", ref: "Hebrews 10:24-25" },
        ],
        teaching: [
          "One of the most overlooked details in Ephesians 6 is the grammar.",
          "Every verb, every pronoun, every instruction in the Armor of God passage is plural. \"Put on the full armor\" is addressed to you all. \"Stand firm\" is a corporate command. \"Take up the shield\" is spoken to a community. Paul is not writing to an individual soldier. He is writing to a regiment. The armor is designed to be worn together.",
          "The Roman military understood this. In battle formation, the thureos shields were not held individually. They were held side by side, creating what was called the testudo, the tortoise formation. Shields interlocked above and to the sides, creating a mobile wall of protection that no single soldier could have achieved alone. An individual shield could be overwhelmed. A wall of shields could not.",
          "This is the image Paul has in mind. And it demolishes the version of faith that most Western Christians practice, which is overwhelmingly individual.",
          "The arrows are designed to isolate. \"No one understands what you're going through.\" \"You're the only one who struggles with this.\" \"If you told someone, they would judge you.\" Each of these lies has the same function: to separate you from the formation, to get you out from behind the wall of shields, to make you hold the line alone. Because alone, you can be overwhelmed. Together, you cannot.",
          "Galatians 6:2 makes the mechanism practical. Carry each other's burdens. When someone in your community is under attack, you physically, verbally, practically stand with them. You hold the shield over them when their arms are too tired to hold it themselves. You speak the truth they cannot remember. You remind them of what God has said when the arrows have been so relentless that they have forgotten.",
          "Isolation is the most dangerous spiritual condition -- more dangerous than doubt, more dangerous than sin, more dangerous than theological confusion. A person in community who doubts has someone to remind them of the truth. A person in isolation who doubts has only the arrows for company.",
          "The shield of faith is a communal weapon. It was designed to be held together. If you are trying to hold it alone, you are not using it as it was intended."
        ],
        practice: {
          duration: "15 Minutes",
          body: "Today's practice takes the arrow log from yesterday and brings it into community.\n\nIdentify one person you trust. A spouse, a friend, a mentor, a small group member. Someone who will not fix you, will not judge you, and will not try to make the arrows go away with a quick Bible verse.\n\nShare three arrows from your log with them. Not all of them. Just three. Tell them: \"These are the lies that keep hitting me. I need someone to stand with me against them.\"\n\nAsk them to do one thing: when they see you believing one of those lies, call it out. Gently. Clearly. \"That's an arrow. That's not what God says about you.\"\n\nThis is the testudo. This is the wall of shields. You were not meant to hold the line alone.",
        },
        reflection: "Who is holding the shield beside you, and have you let them see what you are defending against?",
        prayer: "God,\n\nI have been trying to hold the shield alone, and my arms are tired.\n\nGive me the humility to let someone in. To share the arrows. To stand in formation rather than in isolation.\n\nI know that community costs something. Vulnerability costs something. But isolation costs more.\n\nHelp me trust your people enough to fight beside them.\n\nAmen.",
      },
      {
        num: 4,
        title: "When Faith Feels Impossible",
        stillness: "If your faith feels strong today, receive what follows as preparation. If your faith feels weak today, receive what follows as permission. Either way: you are welcome here.",
        scriptures: [
          { text: "My God, my God, why have you forsaken me? Why are you so far from saving me, so far from my cries of anguish?", ref: "Psalm 22:1" },
          { text: "I waited patiently for the Lord; he turned to me and heard my cry.", ref: "Psalm 40:1" },
          { text: "Lord, I believe; help my unbelief.", ref: "Mark 9:24" },
        ],
        teaching: [
          "There will be seasons when faith does not feel like a shield. It feels like a weight.",
          "The arrows have been coming for so long. The prayers have been unanswered for so long. The silence of God has stretched for so long that the shield feels less like protection and more like a cruel joke. You are standing behind something you cannot see, trusting a voice you cannot hear, and the arrows keep coming regardless.",
          "This is the dark night of the soul. It is the experience described by mystics, saints, and ordinary believers for two thousand years. It is real. And it needs to be named, because the church's failure to talk about it honestly has caused more damage than almost any theological error.",
          "The dark night is a season of faith, not a failure of it. It is the experience of believing without evidence, trusting without reward, standing behind the shield when every feeling, every circumstance, and every thought in your head says the shield is not working.",
          "Psalm 22:1 is the prayer of the dark night. \"My God, my God, why have you forsaken me?\" David wrote it. Jesus quoted it from the cross. The Son of God Himself experienced the feeling of God's absence. If Jesus can feel forsaken and still be held by the Father, then your feeling of forsakenness is not evidence that you have been abandoned. It is evidence that you are human.",
          "The father in Mark 9 remains the most honest person in the Gospels. \"Lord, I believe; help my unbelief.\" Both things were true at the same time. He had faith and he had doubt. He had the shield and he had arrows lodged in it. And Jesus did not require him to resolve the contradiction before He acted. He healed the boy.",
          "This is the permission the church often fails to give: you can have faith and doubt simultaneously. You can hold the shield and feel like it is not working. You can believe in God's goodness and scream at His silence. These are not contradictions. They are the honest posture of a person in the middle of a real fight with a real enemy who uses real arrows.",
          "Psalm 40:1 provides the resolution, but notice the timing. \"I waited patiently for the Lord; he turned to me.\" David waited. The answer was not instant. The shield held during a season when it felt like it was not holding at all. And then God turned -- not when David earned it, not when David felt enough faith, but when God was ready.",
          "On the hardest days, the shield of faith is not the shield of confident faith. It is the shield of stubborn faith. The faith that says, \"I do not feel you. I do not understand this. I cannot see the point. But I will not put the shield down. Not because I am strong, but because I have nowhere else to go.\""
        ],
        practice: {
          duration: "15 Minutes",
          body: "This is a different kind of practice. If you are in a season where faith feels strong, use this time to prepare. Write a letter to yourself for the day when it does not. Remind yourself of what God has done. Remind yourself that the dark night is a season, not a destination. Put the letter somewhere you will find it when you need it.\n\nIf you are in a season where faith feels impossible, use this time to be honest. Open your journal and write a Psalm 22 prayer. Tell God exactly what you feel. The silence. The confusion. The weight. Do not clean it up. Do not resolve it. Just bring it.\n\nThen write one sentence at the bottom: \"I am still here. The shield is still up. That is enough for today.\"",
        },
        reflection: "Have you given yourself permission to have faith and doubt at the same time?",
        prayer: "God,\n\nI am holding the shield, but my arms are shaking.\nI do not feel your presence. I do not understand your timing. I do not see the point of the pain.\n\nBut I am still here. That has to count for something.\n\nHelp my unbelief.\nTurn to me. In your time. I will wait.\n\nI am not putting the shield down. Not because I am strong. Because I have nowhere else to go.\n\nAmen.",
      },
      {
        num: 5,
        title: "The Faith of Others",
        stillness: "There will be days when your faith is not enough. That is not a failure. That is why God gave you a community. Be still. Let someone else's faith carry you for a moment.",
        scriptures: [
          { text: "Some men came, bringing to him a paralyzed man, carried by four of them. Since they could not get him to Jesus because of the crowd, they made an opening in the roof above Jesus by digging through it and then lowered the mat the man was lying on. When Jesus saw their faith, he healed the man.", ref: "Mark 2:3-5" },
          { text: "Therefore encourage one another and build each other up, just as in fact you are doing.", ref: "1 Thessalonians 5:11" },
          { text: "A cord of three strands is not quickly broken.", ref: "Ecclesiastes 4:12" },
        ],
        teaching: [
          "There is a detail in Mark 2 that changes everything about how we understand faith.",
          "Four men bring their paralyzed friend to Jesus. The crowd is too thick to get through, so they climb the roof, dig through it, and lower the man on his mat into the room. It is one of the most dramatic acts of faith in the Gospels. And then Mark records something stunning: \"When Jesus saw their faith, he healed the man.\"",
          "Their faith. Not the paralyzed man's faith. The faith of his friends.",
          "The man on the mat may have believed. He may not have. The text does not say. What the text says is that Jesus responded to the faith of the community around him. The friends carried the man to Jesus. The friends dug through the roof. The friends lowered him down. And it was their faith that moved Jesus to act.",
          "This is a theological reality the Western church, with its emphasis on individual faith, has largely lost. There are seasons when you are the paralyzed man on the mat. Your faith is exhausted. Your arms cannot hold the shield. Your legs cannot stand. In those seasons, the faith of your community becomes your shield. That is the design -- not a failure, not an exception, but the way the body was always meant to work.",
          "Paul tells the Thessalonians to encourage one another and build each other up. The word \"encourage\" is parakaleo, which means to come alongside. It is the same root as Paraclete, the name Jesus gives the Holy Spirit: the one who comes alongside. When your friend speaks truth over you in a season of doubt, they are doing the work of the Spirit. When your small group prays for you when you cannot pray for yourself, they are holding the shield. When someone reminds you of what God has said when the arrows have made you forget, they are carrying you to Jesus.",
          "Ecclesiastes 4:12 provides the structural image. A cord of three strands is not quickly broken. This is not a marriage verse, although it is often used as one. It is a community verse -- the principle that formation and faith are designed to be held in company, not in isolation.",
          "You will need to be carried. That is not weakness. That is what the body is for. And there will be seasons when you carry someone else, when your faith is strong and theirs is failing, and the most important thing you can do is pick up their mat and dig through the roof."
        ],
        practice: {
          duration: "15 Minutes",
          body: "Think of one person in your life whose faith you can lean on. Someone who has been steady when you have wavered. Someone whose belief in God's goodness has anchored you when your own belief was shaking.\n\nWrite them a message today. It does not need to be long. Tell them what their faith has meant to you. Tell them specifically what they said or did that held you up in a season when you could not hold yourself.\n\nThen ask yourself: who might need your faith right now? Who in your community is on the mat? Is there someone you need to carry?\n\nThe shield is communal. Today, practice both sides: being carried and carrying.",
        },
        reflection: "Whose faith has carried you when yours was not enough?",
        prayer: "God,\n\nThank you for the people who have carried me when I could not walk.\nThe friends who dug through the roof. The voices that spoke truth when I had forgotten it. The faith that was not mine but held me anyway.\n\nHelp me be that for someone else.\nShow me who is on the mat. Give me the strength to carry them.\n\nAnd in the seasons when I am the one who cannot move, give me the humility to be carried.\n\nAmen.",
      },
      {
        num: 6,
        title: "The Arrow Log",
        stillness: "This is the final day of this track. You have learned to identify the arrows, to hold the shield, to stand in community, and to trust even when it feels impossible. Today you build the tool that holds it all together. Take your time.",
        scriptures: [
          { text: "We demolish arguments and every pretension that sets itself up against the knowledge of God, and we take captive every thought to make it obedient to Christ.", ref: "2 Corinthians 10:5" },
          { text: "Then you will know the truth, and the truth will set you free.", ref: "John 8:32" },
          { text: "Submit yourselves, then, to God. Resist the devil, and he will flee from you.", ref: "James 4:7" },
        ],
        teaching: [
          "The arrow log is a discipline of catching.",
          "On Day 2, you learned to identify the arrows. On Day 3, you brought them into community. On Day 4, you learned to hold the shield when faith feels impossible. Today you systematize the practice into something you can sustain.",
          "2 Corinthians 10:5 is the operating instruction. Take every thought captive. The word \"captive\" is aichmalotizo, a military term meaning to take prisoner of war. You do not ask the thought to please identify itself. You seize it. You examine it. You determine whether it is from God or from the enemy. And if it is an arrow, you replace it with the truth.",
          "The arrow log is the physical tool for this discipline: two columns, left and right. Left column: the lie. Right column: what God has said. Every time you catch an arrow, you write it down on the left. Then you search Scripture for the truth that contradicts it and write it on the right. Over time, patterns emerge. You begin to see which arrows fire most frequently. You begin to recognize the enemy's preferred attack vectors. And you begin to have the truth pre-loaded, ready to deploy the moment the arrow arrives.",
          "This is how Jesus operated in the wilderness. In Matthew 4, the enemy fires three arrows. Each time, Jesus responds with Scripture -- not arguments, not feelings, not theological reasoning, but the specific, memorized, spoken word of God. \"It is written.\" Three words that function as a shield, a sword, and a declaration all at once.",
          "James 4:7 provides the promise. Resist the devil, and he will flee from you. But notice the sequence: submit to God first, then resist. The arrow log is an act of submission before it is an act of resistance. You submit to the truth of what God has said. From that submitted position, you resist the lie. The lie cannot stand against the truth. It will flee -- not because you are powerful, but because the truth is.",
          "Build this into a weekly discipline. Keep the log in your journal, your phone, or a dedicated notebook. Review it weekly. Add to it as new arrows are identified. Let it become a living document of the battle and the truth that wins it."
        ],
        practice: {
          duration: "20 Minutes",
          body: "Today you formalize your arrow log. This is your cumulative artifact for this track.\n\nTake a fresh page or open a new document. Create two columns. Label the left column \"The Lie.\" Label the right column \"What God Has Said.\"\n\nGo back through the arrows you identified on Day 2. For each one, find a specific Scripture that contradicts it. Write the lie on the left and the truth on the right.\n\nHere are examples:\n\nThe Lie: \"I am too far gone.\" What God Has Said: \"There is now no condemnation for those who are in Christ Jesus.\" Romans 8:1\n\nThe Lie: \"God has forgotten me.\" What God Has Said: \"I will never leave you nor forsake you.\" Hebrews 13:5\n\nThe Lie: \"I will always be this way.\" What God Has Said: \"He who began a good work in you will carry it on to completion.\" Philippians 1:6\n\nAim for five to seven entries. Then commit to a weekly review: one evening per week, you open the log, review the arrows, review the truth, and add any new entries from the past seven days.\n\nShare the log with the person you identified on Day 3. Let them see the arrows and the truths. This is the testudo in written form.",
        },
        reflection: "What has God shown you about faith this week that you do not want to forget?",
        prayer: "God,\n\nThank you for six days of learning to hold the shield.\n\nI now see the arrows more clearly. I know their patterns. I know where they aim. And I know what you have said in response.\n\nHelp me keep the log. Help me review it. Help me stand behind what you have declared, even when the arrows say otherwise.\n\nThe shield is up. The truth is written. The community is beside me.\n\nI am not putting it down.\n\nAmen.",
      },
    ],
  },
  "helmet-of-salvation": {
    num: "05",
    title: "Helmet of Salvation",
    icon: "/Helmet_white_icon.png",
    trackTitle: "A Protected Mind",
    img: "/Helmet_Hero_wide.png",
    cumulative: "First Fifteen morning practice design",
    days: [
      {
        num: 1,
        title: "The Mind as Contested Territory",
        stillness: "Before you read, notice what your mind is doing. It is probably already ahead of you, planning, worrying, replaying, anticipating. Call it back. You are here. In this moment. Let your mind arrive before you ask it to receive.",
        scriptures: [
          { text: "Take the helmet of salvation.", ref: "Ephesians 6:17" },
          { text: "For God has not given us a spirit of fear, but of power, love, and a sound mind.", ref: "2 Timothy 1:7" },
          { text: "Set your minds on things above, not on earthly things.", ref: "Colossians 3:2" },
        ],
        teaching: [
          "The helmet protects the head. In a Roman soldier's equipment, it was the last piece put on, the final act of preparation before stepping onto the battlefield. It covered the skull, the temples, the back of the neck. A soldier could survive a wound to the arm, the leg, even the torso. A blow to the unprotected head was fatal.",
          "Paul assigns salvation to the helmet. The mind.",
          "This is a deliberate theological statement. The mind is the most contested territory in the spiritual life -- where identity is formed, where belief is held, where the narrative of your life is constructed. If the enemy can shape your thinking, he does not need to shape anything else. The behavior will follow. The emotions will follow. The relationships will follow. Win the mind, win the person.",
          "2 Timothy 1:7 defines what a protected mind looks like: power, love, and soundness. The Greek word for \"sound mind\" is sophronismos, which means self-discipline of thought -- the ability to think clearly, to assess accurately, and to resist the distortions that fear and anxiety produce. This is not natural in a world that assaults your mind from the moment you wake up. It is a gift. It is what the helmet provides.",
          "Consider the daily assault. Before you have finished your first cup of coffee, your mind has been exposed to notifications, headlines, social media, emails, and the accumulated anxiety of whatever algorithm decided you should see this morning. None of this was curated for your formation. All of it was curated for engagement. And engagement, in the attention economy, is driven by fear, outrage, and comparison. Your mind has been under attack before you have been awake for thirty minutes.",
          "The helmet of salvation is God's answer to this. Salvation here is not just the future promise of eternity. It is the present reality of a settled identity. You belong to God. Your mind belongs to God. Before the headlines, before the notifications, before the comparison and the anxiety, there is a truth that sits over your thoughts like a helmet: you are saved, you are known, you are held. The day's inputs do not get to define you. They land on the helmet. And the helmet holds."
        ],
        practice: {
          duration: "15 Minutes",
          body: "Today's practice is a simple but revealing diagnostic.\n\nTrack the first thirty minutes of your morning tomorrow. From the moment your alarm goes off, pay attention to what your mind consumes. What do you reach for first? What enters your thoughts before you have made a conscious decision about what to think?\n\nWrite it down. Be honest. The phone. The news. The email. The worry. The mental to-do list.\n\nThen ask: Is this protecting my mind or assaulting it?\n\nYou do not have to change anything yet. Today is about awareness. Tomorrow we start rebuilding.",
        },
        reflection: "What gets to your mind first in the morning, and what is that doing to you?",
        prayer: "God,\n\nMy mind is under assault and I have not been protecting it.\nI have been handing my first thoughts to screens and systems that were not designed for my formation.\n\nToday I acknowledge that my mind belongs to you before it belongs to the day.\n\nGive me a sound mind. Power instead of fear. Love instead of comparison. Clarity instead of noise.\n\nProtect my head. I need the helmet.\n\nAmen.",
      },
      {
        num: 2,
        title: "Salvation as Present Reality",
        stillness: "Salvation is not only where you are going. It is where you already are. Sit with that before you read further. You are saved. Present tense. Right now.",
        scriptures: [
          { text: "For he has rescued us from the dominion of darkness and brought us into the kingdom of the Son he loves.", ref: "Colossians 1:13" },
          { text: "Therefore, if anyone is in Christ, the new creation has come: The old has gone, the new is here!", ref: "2 Corinthians 5:17" },
          { text: "Being confident of this, that he who began a good work in you will carry it on to completion until the day of Christ Jesus.", ref: "Philippians 1:6" },
        ],
        teaching: [
          "Most Christians think of salvation primarily in tenses that are not present. Saved, past tense, from the penalty of sin. Will be saved, future tense, into eternity with God. Both of those are true. But the helmet of salvation operates in the present tense. And a present-tense salvation changes how the mind works.",
          "Present-tense salvation means this: you have already been transferred from one kingdom to another. Colossians 1:13 uses rescue language. God has rescued you from the dominion of darkness. Past tense. Completed action. You are not waiting to be rescued. You are not mid-rescue. You have been rescued, and you now live in the kingdom of the Son.",
          "This matters for your mind because the primary weapon against your thought life is the lie that you are still defined by the old kingdom. Still defined by your past. Still defined by your failures. Still trapped in patterns that salvation should have broken. The enemy's strategy is to convince you that salvation is a future hope but not a present reality, that the transformation promised in 2 Corinthians 5:17 has not actually happened to you.",
          "Paul does not say the new creation might come. He says it has come. The old has gone. The new is here. These are not aspirational statements. They are declarations of accomplished fact. The question is not whether you have been made new. The question is whether you will believe it and live accordingly.",
          "Philippians 1:6 addresses the gap between the declaration and the experience. He who began a good work in you will carry it on to completion. The transformation is real and it is ongoing. You are not the person you were, and you are not yet the person you will be. But the direction is set. The work is underway. And the one doing the work is faithful to complete it.",
          "The helmet covers your mind with this truth. When the old patterns resurface and you think, \"Nothing has changed,\" the helmet says, \"Everything has changed. The new creation has come.\" When the enemy whispers, \"You are still that person,\" the helmet says, \"That person is gone. You have been rescued.\" When your thought life spirals into despair about your own transformation, the helmet says, \"The one who started this will finish it. Your progress is not your job. It is His.\""
        ],
        practice: {
          duration: "15 Minutes",
          body: "Open your journal. Write the words: \"I am a new creation.\"\n\nBelow that, answer this question: Where do I still live as if the old creation is true? Where do I still define myself by the patterns, failures, or identity of the person I was before Christ?\n\nBe specific. It might be a sin pattern you believe will never change. A label you have carried since childhood. A narrative about yourself that predates your faith. A way of thinking about your future that assumes the worst based on your past.\n\nName it. Then write 2 Corinthians 5:17 underneath: \"The old has gone, the new is here.\"\n\nThis is not pretending the patterns are gone. It is choosing to believe the declaration over the experience. It is putting on the helmet.",
        },
        reflection: "Where are you still living out of an old identity that salvation has already replaced?",
        prayer: "God,\n\nI have been living as if salvation is only future.\nI have forgotten that you have already rescued me. Already made me new. Already begun the work.\n\nWhen the old patterns tell me nothing has changed, remind me that everything has.\nWhen the old identity tries to reclaim me, hold the helmet over my mind.\n\nI am a new creation. Help me live like it.\n\nAmen.",
      },
      {
        num: 3,
        title: "Thought Patterns and Renewal",
        stillness: "Your mind has been running familiar paths for years. Some of those paths lead somewhere good. Some do not. Today is about seeing the paths clearly. Take a breath. Awareness comes before change.",
        scriptures: [
          { text: "Do not conform to the pattern of this world, but be transformed by the renewing of your mind.", ref: "Romans 12:2" },
          { text: "Finally, brothers and sisters, whatever is true, whatever is noble, whatever is right, whatever is pure, whatever is lovely, whatever is admirable — if anything is excellent or praiseworthy — think about such things.", ref: "Philippians 4:8" },
          { text: "As a man thinks in his heart, so is he.", ref: "Proverbs 23:7" },
        ],
        teaching: [
          "Neuroscience has confirmed what Scripture has always taught: you become what you think about.",
          "The brain operates on neural pathways. Every time you think a thought, the pathway for that thought strengthens. The more frequently a thought is repeated, the deeper the groove becomes, and the more naturally the brain defaults to that pathway in the future. This is why anxiety spirals are so hard to break -- not because you want to be anxious, but because the neural pathway for anxious thinking has been reinforced thousands of times, and your brain now travels it automatically.",
          "This is also why Paul's instruction in Romans 12:2 is so precisely stated. Be transformed by the renewing of your mind. The renewal of your mind, specifically. Because the mind is where the patterns live. Change the patterns, and the behavior follows. Change the patterns, and the emotions shift. The person is transformed from the inside, not the surface.",
          "Philippians 4:8 is not a suggestion for positive thinking. It is a formation strategy. Paul gives eight categories of thought: true, noble, right, pure, lovely, admirable, excellent, praiseworthy. He is prescribing the inputs that will create healthy neural pathways. Think about these things -- not occasionally, not when you remember, but as a discipline. A daily decision about what your mind will feed on.",
          "Proverbs 23:7 puts it in the starkest possible terms. As a man thinks in his heart, so is he. Your thought life is not a separate category from your identity. It is the factory where your identity is manufactured. What you think about repeatedly, you become. What you meditate on, you grow into. What you feed your mind, your life eventually expresses.",
          "The helmet of salvation protects the mind so that this renewal can happen. Without it, the mind is exposed to every input, every lie, every distortion that the world and the enemy can produce. With it, there is a filter -- not a filter that removes all negative input, but one that gives you the capacity to evaluate the input against the truth of who you are in Christ. The lie lands on the helmet. You examine it. You compare it to what God has said. And then you choose which pathway to reinforce: the old one, or the new one.",
          "This is slow work. Neural pathways reinforced for decades do not disappear in a week. But they can be replaced. One thought at a time. One day at a time. One deliberate choice at a time. The brain's neuroplasticity is God's gift to the process of sanctification. You are not stuck. The pathways can change. But you have to do the work of choosing new ones."
        ],
        practice: {
          duration: "15 Minutes",
          body: "Identify one recurring thought pattern that is forming you in the wrong direction. It might be a pattern of comparison, self-criticism, catastrophizing, or despair.\n\nWrite it down as specifically as you can. Not \"I think negatively.\" Something concrete: \"When I see someone more successful than me, I immediately conclude that I am falling behind and that my life is wasted.\"\n\nNow write a replacement thought. Not a denial. A replacement. One that is true, noble, right, pure, lovely, admirable, excellent, or praiseworthy. Root it in Scripture if you can.\n\nFor the next seven days, every time you catch the old pattern firing, speak the replacement out loud. You are not suppressing the old thought. You are building a new pathway alongside it. Over time, the new pathway will become the default.",
        },
        reflection: "What thought pattern has been forming you in the wrong direction, and what truth could replace it?",
        prayer: "God,\n\nMy mind has been running on pathways I did not choose.\nPatterns of comparison, fear, and self-criticism that have been reinforced for years.\n\nI cannot undo them overnight. But I can start building new ones today.\n\nRenew my mind. Not all at once. One thought at a time.\nHelp me choose the true, the noble, the right, the pure.\nHelp me think about these things until they become the default.\n\nTransform me from the inside out.\n\nAmen.",
      },
      {
        num: 4,
        title: "The Helmet and Mental Health",
        stillness: "Today we address something the church has often handled poorly. If you struggle with your mental health, you are not disqualified. You are not faithless. You are human. And what you are about to read is for you.",
        scriptures: [
          { text: "He came to a broom bush, sat down under it and prayed that he might die. 'I have had enough, Lord,' he said.", ref: "1 Kings 19:4" },
          { text: "Why, my soul, are you downcast? Why so disturbed within me? Put your hope in God.", ref: "Psalm 42:5" },
          { text: "The Lord is close to the brokenhearted and saves those who are crushed in spirit.", ref: "Psalm 34:18" },
        ],
        teaching: [
          "Elijah had just experienced one of the greatest spiritual victories in the history of Israel. Fire from heaven. The prophets of Baal defeated. The people returning to God. And immediately afterward, he ran into the wilderness, collapsed under a bush, and asked God to let him die.",
          "This is not a faith failure. This is what happens to a human body and mind after extreme stress, prolonged spiritual combat, and the emotional crash that follows sustained intensity. Elijah was exhausted, isolated, and depleted. He was experiencing what we would now recognize as depression. And God's response was not a rebuke. It was bread, water, and sleep.",
          "This matters because the church has often treated mental health struggles as spiritual problems with spiritual solutions. If you are anxious, you are not trusting God enough. If you are depressed, you are not grateful enough. If you cannot stop the spiraling thoughts, you are not praying enough. This framing is not just unhelpful. It is cruel. And it drives people away from both God and the help they need.",
          "The helmet of salvation provides a theological framework for meeting mental health struggles without shame, without self-condemnation, and without the lie that your struggle means you have failed God. It is a truth about who you are, not a technique for fixing what is broken.",
          "Here is the framework: your mind is under assault -- that is what the armor passage teaches. The assault comes from spiritual, cultural, and biological sources simultaneously. The enemy fires arrows. The culture bombards you with inputs. And your brain, which is a physical organ subject to the same vulnerabilities as every other organ in your body, sometimes struggles to process it all. Depression, anxiety, OCD, PTSD: these are not character flaws. They are the reality of living in a broken world with a mind that is both spiritual and physical.",
          "The helmet of salvation says this over your mental health: you are still saved. You are still known. You are still held. Your salvation is not contingent on the health of your brain chemistry any more than it is contingent on the health of your liver. God met Elijah with bread and sleep before He met him with a mission. Sometimes the most spiritual thing you can do is rest, eat, and ask for help.",
          "Psalm 34:18 is the word over this day. The Lord is close to the brokenhearted and saves those who are crushed in spirit. Close. Not distant. Not disappointed. Not waiting for you to pull yourself together. Close."
        ],
        practice: {
          duration: "15 Minutes",
          body: "This practice is gentler than the others.\n\nIf you are in a season of mental health struggle, today's assignment is not to write or analyze or build a tool. It is to take one step toward help. That might mean scheduling an appointment with a counselor. It might mean telling one person the truth about how you are doing. It might mean acknowledging for the first time that what you have been calling a \"spiritual struggle\" might also be a mental health reality that deserves professional care.\n\nIf you are not currently struggling, today's assignment is to prepare. Write down the name and contact information of one mental health professional you could call if you needed to. Having the resource available before the crisis is itself a form of protection. It is putting the helmet on before the battle starts.\n\nEither way, speak this truth over yourself: \"My mental health does not determine my standing with God. I am saved, known, and held, even on the days my mind does not cooperate.\"",
        },
        reflection: "Have you been treating a mental health struggle as a spiritual failure? What would it mean to receive care without shame?",
        prayer: "God,\n\nThank you for meeting Elijah with bread and sleep before you met him with a mission.\n\nIf my mind is struggling, that does not mean my faith has failed.\nIf I need help, that does not mean I have disappointed you.\n\nYou are close to the brokenhearted. That means you are close to me.\n\nGive me the courage to ask for help if I need it.\nGive me the grace to receive it without shame.\n\nProtect my mind, Lord. With truth and with care.\n\nAmen.",
      },
      {
        num: 5,
        title: "Digital Formation and the Mind",
        stillness: "The device in your hand is not neutral. It is a formation tool. Whether it forms you toward God or away from God depends on how you use it. Before you continue, consider putting it down for sixty seconds. Then pick it back up deliberately. That is already a different relationship with it.",
        scriptures: [
          { text: "I will not set before my eyes anything that is worthless.", ref: "Psalm 101:3" },
          { text: "Above all else, guard your heart, for everything you do flows from it.", ref: "Proverbs 4:23" },
          { text: "Be very careful, then, how you live — not as unwise but as wise, making the most of every opportunity, because the days are evil.", ref: "Ephesians 5:15-16" },
        ],
        teaching: [
          "The average person checks their phone between 96 and 150 times per day. Each check delivers a burst of information that your brain must process, categorize, and emotionally respond to. Over the course of a day, your mind processes more information than any previous generation encountered in a week. And almost none of it was chosen deliberately.",
          "This is a formation crisis.",
          "The greatest threat to the Christian mind in the twenty-first century is not heresy. It is distraction -- the slow, constant erosion of your ability to be present, to think deeply, to sit with God in silence, and to sustain a single train of thought without reaching for a screen. The device has trained your brain to expect constant stimulation. And a brain that expects constant stimulation cannot be still. A brain that cannot be still cannot hear God.",
          "Psalm 101:3 is a personal commitment: I will not set before my eyes anything that is worthless. The word \"worthless\" in Hebrew is belial, which means destruction, wickedness, and emptiness. Most of what the algorithm serves you is not wicked. It is empty. And emptiness, consumed in volume, is its own form of destruction. It fills the space that silence would have occupied. It takes the attention that Scripture would have received. It shapes the mind that God was trying to renew.",
          "Proverbs 4:23 uses the language of guarding. Guard your heart, for everything flows from it. In the context of digital consumption, guarding means choosing -- deciding what enters your mind rather than allowing the algorithm to decide for you. Treating your attention as a finite resource that you steward rather than an unlimited commodity that you spend.",
          "The helmet of salvation applied to digital life means this: your mind belongs to God before it belongs to the internet. The first input of your day matters. The accumulated inputs of your day matter. The willingness to create space for silence, Scripture, and sustained thought in a world that relentlessly opposes all three is one of the most important disciplines a modern Christian can practice.",
          "The phone is a tool. A tool that is never put down becomes a master. And a mind that is always stimulated cannot be renewed."
        ],
        practice: {
          duration: "15 Minutes",
          body: "This practice is concrete and immediate.\n\nPick one of these three digital boundaries and implement it today. Not next week. Today.\n\nOption one: No phone for the first thirty minutes after waking and the last thirty minutes before sleep. Use an alarm clock instead of your phone alarm if needed.\n\nOption two: Delete one app that consistently makes you less present, less peaceful, or less focused. Not forever if that feels too large. For fourteen days. Notice what changes.\n\nOption three: Set a daily screen time limit for your most-used non-essential app. Start with a limit that is thirty minutes less than your current average.\n\nWrite down which boundary you chose and why. Then tell one person. Not for accountability as performance. For accountability as protection.",
        },
        reflection: "What is the relationship between your screen time and your ability to hear God?",
        prayer: "God,\n\nMy mind has been colonized by inputs I did not choose.\nI have been giving my attention to systems designed for engagement, not for formation.\n\nHelp me guard what enters my mind.\nHelp me choose silence over stimulation.\nHelp me steward my attention as a gift rather than spend it as a commodity.\n\nMy mind belongs to you before it belongs to the screen.\n\nAmen.",
      },
      {
        num: 6,
        title: "The Morning Helmet",
        stillness: "This is the last day of this track. What you build today is the practice that protects your mind every morning before the day begins. Take your time. This is an investment in every day that follows.",
        scriptures: [
          { text: "Very early in the morning, while it was still dark, Jesus got up, left the house and went off to a solitary place, where he prayed.", ref: "Mark 1:35" },
          { text: "O Lord, in the morning you hear my voice; in the morning I prepare a sacrifice for you and watch.", ref: "Psalm 5:3" },
          { text: "Let the morning bring me word of your unfailing love, for I have put my trust in you. Show me the way I should go, for to you I entrust my life.", ref: "Psalm 143:8" },
        ],
        teaching: [
          "There is a reason the ancient church oriented its most important practices around the morning.",
          "The hora prima, the first hour, was not arbitrary. It was strategic. The early church understood that the first input of the day sets the trajectory for everything that follows. A mind that begins in Scripture, silence, and prayer has been oriented toward God before the world has a chance to orient it toward anything else. A mind that begins in notifications, news, and the accumulated anxieties of the inbox has already been formed by the world before God gets a word in.",
          "Jesus modeled this. Mark 1:35 records that in the middle of His most demanding ministry season, Jesus got up before dawn and went to a solitary place to pray. This was not a performance of spirituality. It was a survival strategy. Jesus knew that the demands of the day would press in. The crowds, the needs, the opposition. If He did not begin with the Father, the day would begin with the demands, and the demands would set the agenda.",
          "The morning helmet is the daily practice of putting on the truth of your salvation before any other input reaches your mind. The structure is simple: fifteen minutes, three movements, before any screen.",
          "Five minutes of silence. Not prayer with words. Silence. Letting the mind settle. Letting the noise from yesterday and the anxiety about today drain away. This is the act of arriving in God's presence before you ask anything of Him.",
          "Five minutes of Scripture. Not a study. Not a commentary. A slow, deliberate reading of a short passage -- Psalm 23, Psalm 46, John 15, Romans 8. Let the words wash over your mind. You are not trying to learn something. You are trying to be formed by something.",
          "Five minutes of declaration. Speak the truth of your identity over yourself. You can use the morning declaration from the Breastplate track. You can speak Scripture directly: \"I am saved. I am known. I am held. My mind belongs to God before it belongs to the day.\" The act of speaking the truth aloud before the world speaks its version is itself the helmet going on.",
          "That is fifteen minutes. It is not a large investment. But compounded over weeks and months and years, it is the single most transformative daily practice available to a modern Christian -- not because fifteen minutes is magical, but because what gets your first attention gets your formation."
        ],
        practice: {
          duration: "20 Minutes",
          body: "Today you design your First Fifteen.\n\nWrite out your morning structure. Three movements. Five minutes each. Be specific.\n\nSilence: Where will you sit? What time will you begin? How will you handle the pull toward your phone?\n\nScripture: What passage will you start with this week? Write it down. Have it ready so you do not have to search for it in the morning.\n\nDeclaration: What will you speak? Write two to three sentences that declare the truth of your identity. Place them where you will see them.\n\nSet an alarm for tomorrow morning that is fifteen minutes earlier than your current wake time. Label it: \"Helmet on.\"\n\nThen tell one person what you are building and why. Ask them to check in after seven days.\n\nThis is your cumulative artifact. The First Fifteen. It is the helmet you put on every morning before the day's arrows begin to fly.",
        },
        reflection: "What has God shown you about your mind this week that you do not want to forget?",
        prayer: "God,\n\nThank you for six days of learning to protect my mind.\n\nI have seen how unguarded it has been. How many inputs I have accepted without choosing them. How many thoughts I have believed without examining them. How much formation has happened to me rather than in me.\n\nTomorrow I put the helmet on. Fifteen minutes. Silence, Scripture, and declaration. Before the world speaks, I will hear your voice.\n\nProtect my mind, Lord. It belongs to you.\n\nAmen.",
      },
    ],
  },
  "sword-of-the-spirit": {
    num: "06",
    title: "Sword of the Spirit",
    icon: "/Sword_white_icon.png",
    trackTitle: "The Word as Weapon",
    img: "/Sword_Hero_wide.png",
    cumulative: "Verse memorization system + first 5 verses",
    days: [
      {
        num: 1,
        title: "The Only Offensive Weapon",
        stillness: "Every piece of armor before this one was defensive. It was designed to help you stand. The sword is different. The sword is designed to advance. Take a breath. Today you pick up the weapon.",
        scriptures: [
          { text: "Take the sword of the Spirit, which is the word of God.", ref: "Ephesians 6:17" },
          { text: "For the word of God is alive and active. Sharper than any double-edged sword, it penetrates even to dividing soul and spirit, joints and marrow; it judges the thoughts and attitudes of the heart.", ref: "Hebrews 4:12" },
          { text: "All Scripture is God-breathed and is useful for teaching, rebuking, correcting and training in righteousness.", ref: "2 Timothy 3:16" },
        ],
        teaching: [
          "Five pieces of armor. All defensive. Belt, breastplate, shoes, shield, helmet. Every one of them is designed to help you stand firm, to protect what you have, to endure what comes. They are essential. Without them, you are exposed. But they do not advance. They do not push back the darkness. They do not take territory.",
          "The sword of the Spirit is the weapon that changes the posture from defense to offense.",
          "Paul defines it with absolute precision: the word of God. Specific. Alive. Active. Not theology about God in general, not ideas inspired by Him, but the word -- the specific, spoken utterance that carries the authority of God Himself.",
          "Hebrews 4:12 describes this word in surgical terms. It is alive. It is active. It is sharper than a double-edged sword. It penetrates. It divides. It judges the thoughts and attitudes of the heart. This is not a passive text. It is an animate force. When you open the Bible, you are not reading a historical document. You are handling a living weapon.",
          "The Greek word Paul uses for \"word\" in Ephesians 6:17 is not logos, the broad term for the word of God. It is rhema, which means a specific, spoken utterance. Paul is not telling you to carry a Bible on your belt. He is telling you to have specific Scriptures ready to speak in specific moments. The sword is not the Bible in general. It is the right verse in the right moment, spoken with authority.",
          "Jesus demonstrated this in the wilderness. In Matthew 4, the enemy comes with three specific temptations. Jesus does not argue, reason, or engage in theological debate. He speaks Scripture. Three times: \"It is written.\" Each time, a specific text aimed at a specific lie. The sword was precise. It was rehearsed. It was ready.",
          "Every Christian owns the word of God. Very few have trained with it. Very few have specific Scriptures memorized, internalized, and ready to deploy in the moment the arrow arrives. The sword hangs at the side, unused -- not because it lacks power, but because the soldier lacks training.",
          "2 Timothy 3:16 says all Scripture is useful: teaching, rebuking, correcting, training in righteousness. Two of the four functions are corrective. The word does not just affirm. It confronts. It cuts through the lies, the distortions, and the self-deceptions and speaks the truth with the authority of God Himself. This is why the sword is the only offensive weapon. It is the only thing in the armor that can push back against the darkness rather than simply endure it."
        ],
        practice: {
          duration: "15 Minutes",
          body: "Today's practice is a baseline assessment. Answer honestly:\n\nHow many verses of Scripture can you quote from memory right now? Not paraphrase. Quote. The actual words, with a reference.\n\nIf the answer is fewer than five, you are not unusual. You are average. And average, in a world that is forming your mind at the speed of your feed, is unarmed.\n\nWrite down every verse you currently know by heart. Even partial ones. Even ones you learned as a child. Get them on paper.\n\nThen choose one new verse to memorize this week. Not a chapter. Not a passage. One verse. Write it on a card or in your phone. Speak it aloud three times. You have begun your training.",
        },
        reflection: "If the enemy came at you with a lie tonight, could you answer with Scripture? Not the gist of it, but the words themselves?",
        prayer: "God,\n\nI have been carrying the sword without training with it.\nI know about your word. But I do not know it well enough to wield it when the moment comes.\n\nChange that. Starting today.\nGive me hunger for the text. Give me discipline to memorize it. Give me the readiness to speak it when the arrows fly.\n\nYour word is alive. Teach me to use it.\n\nAmen.",
      },
      {
        num: 2,
        title: "Jesus in the Wilderness",
        stillness: "The Son of God Himself needed the word to fight. That should tell you something about how important this practice is. Be here. Learn from the master swordsman.",
        scriptures: [
          { text: "Then Jesus was led by the Spirit into the wilderness to be tempted by the devil.", ref: "Matthew 4:1" },
          { text: "Jesus answered, 'It is written: Man shall not live on bread alone, but on every word that comes from the mouth of God.'", ref: "Matthew 4:4" },
          { text: "Jesus answered him, 'It is also written: Do not put the Lord your God to the test.'", ref: "Matthew 4:7" },
          { text: "Jesus said to him, 'Away from me, Satan! For it is written: Worship the Lord your God, and serve him only.'", ref: "Matthew 4:10" },
        ],
        teaching: [
          "Matthew 4 is the masterclass in how the sword works.",
          "Jesus has just been baptized. The Father has declared Him beloved. The Spirit has descended. And immediately, the same Spirit leads Him into the wilderness to be tempted. This sequence matters. The battle comes after the blessing. The arrows follow the affirmation. If you have ever experienced spiritual attack immediately after a season of growth or breakthrough, you are in good company. The pattern is as old as the gospel itself.",
          "The enemy's strategy is sophisticated. He does not start with an obvious lie. He starts with a half-truth. \"If you are the Son of God, tell these stones to become bread.\" The \"if\" is the arrow. Jesus has just been declared the Son of God by the Father Himself. The enemy is not questioning whether Jesus is the Son of God. He is tempting Jesus to prove it on the enemy's terms -- to demonstrate His identity through performance rather than rest in the Father's declaration.",
          "Jesus' response is not a theological argument. It is three words followed by a citation: \"It is written.\" He quotes Deuteronomy 8:3. He does not explain why the verse is relevant. He does not engage with the premise. He simply speaks the word and lets the word do the work.",
          "The second temptation escalates. The enemy quotes Scripture himself, twisting Psalm 91 to suggest that Jesus should throw Himself off the temple and let the angels catch Him. This is critical: the enemy knows Scripture too. He can quote it. He can twist it. The sword in the wrong hands becomes a weapon of deception. Jesus responds with another citation, Deuteronomy 6:16, and the counter-text corrects the distortion.",
          "The third temptation is the most brazen. All the kingdoms of the world in exchange for worship. Jesus' response is the sharpest: \"Away from me, Satan! For it is written: Worship the Lord your God, and serve him only.\" Deuteronomy 6:13. And the enemy leaves.",
          "Three temptations. Three responses. Three specific texts from Deuteronomy, spoken with authority, aimed with precision. Jesus did not reach for a concordance. He did not search for the right verse. He had the verses stored, ready, and wielded them in real time.",
          "This is weapons training. Not studying about the sword. Using it. In the moment. Against a real enemy. With specific, memorized, spoken truth."
        ],
        practice: {
          duration: "15 Minutes",
          body: "Take the verse you chose yesterday and write it out by hand three times. Then close the page and write it from memory. Check your accuracy. Repeat until you can write it perfectly without looking.\n\nNow practice wielding it. Think of one specific lie the enemy has used against you recently. Speak the lie out loud. Then speak the verse out loud in response, beginning with: \"It is written.\"\n\nThis feels strange the first time. Do it anyway. You are training your voice, your mind, and your spirit to respond to the arrow with the word. Over time, this reflex becomes as natural as the lie itself currently is.",
        },
        reflection: "How would your response to the enemy's lies change if you had Scripture memorized and ready?",
        prayer: "God,\n\nJesus fought the enemy with your word. Three specific texts. Spoken out loud. Aimed with precision.\n\nI want to be that ready.\n\nHelp me memorize. Help me practice. Help me build the reflex of responding to lies with truth, not with arguments, not with feelings, but with \"It is written.\"\n\nTrain me for the wilderness.\n\nAmen.",
      },
      {
        num: 3,
        title: "Biblical Illiteracy",
        stillness: "Today we name something uncomfortable. Not to shame you, but to see it clearly. Because you cannot fix what you will not face. Be here. Let honesty do its work.",
        scriptures: [
          { text: "My people are destroyed for lack of knowledge.", ref: "Hosea 4:6" },
          { text: "How can a young person stay on the path of purity? By living according to your word. I have hidden your word in my heart that I might not sin against you.", ref: "Psalm 119:9, 11" },
          { text: "Do your best to present yourself to God as one approved, a worker who does not need to be ashamed and who correctly handles the word of truth.", ref: "2 Timothy 2:15" },
        ],
        teaching: [
          "Here is a fact that should alarm every church leader, every pastor, and every Christian who cares about the health of the body of Christ: biblical illiteracy in the Western church is at historic levels.",
          "Studies consistently show that most self-identified Christians cannot name all four Gospels. A significant majority cannot name the first book of the Bible. Most cannot articulate basic doctrines of the faith with any specificity. And the percentage who regularly read their Bible outside of a church service has been declining for decades.",
          "This is a formation problem, not a generational or technological one. The church has produced a generation of Christians who feel things about God but know very little of what He has actually said. They have impressions, sentiments, and vague notions of grace. But they cannot find Ephesians. They cannot distinguish Paul from Peter. They cannot explain the gospel in a way that holds up under a single serious question.",
          "Hosea 4:6 is God's diagnosis: my people are destroyed for lack of knowledge. Not lack of sincerity. Not lack of church attendance. Lack of knowledge. The sword is hanging at their side, and they have never drawn it, because they do not know what it says.",
          "Ability and education level are not the issue. Some of the most biblically literate people in history were farmers, slaves, and children who had no formal education but knew the text because they read it, heard it, memorized it, and loved it. The issue is priority -- and priority is the one thing no one can claim is out of their control.",
          "Psalm 119:11 provides both the method and the motivation. \"I have hidden your word in my heart that I might not sin against you.\" The word \"hidden\" is tsaphan, which means to store up, to treasure, to lay away for future use. This is deliberate internalization. And the purpose is not academic. It is protective. The word in your heart is the sword in your hand. It protects you from sin, from lies, and from the drift that comes when you have nothing solid to stand on.",
          "2 Timothy 2:15 says to correctly handle the word of truth. The word \"correctly handle\" is orthotomeo, which means to cut straight, to divide accurately. This is a craft. A sword swung wildly is as dangerous to the wielder as it is to the enemy. A sword handled with skill, aimed precisely, that cuts where it is meant to cut, is devastating.",
          "The path back from biblical illiteracy is not complicated. It is simply not easy. It requires reading, daily and consistently. It requires memorizing, one verse at a time. It requires studying, not to accumulate knowledge, but to wield the word with accuracy. And it requires the humility to admit that you may not be as familiar with the text as you assumed."
        ],
        practice: {
          duration: "15 Minutes",
          body: "Today you build a reading plan. Not a complex one. A sustainable one.\n\nChoose one book of the Bible to read this month. If you are new to this, start with the Gospel of John or the book of Philippians. Both are short enough to finish in a month at one chapter per day.\n\nWrite the book name, the start date, and the plan: one chapter per day. Put it in your phone calendar. Attach it to an existing habit, such as your morning coffee or your commute.\n\nThen recommit to your verse memorization. Write this week's verse on a card and place it where you will see it at least three times today: your bathroom mirror, your dashboard, your desk.\n\nYou are not behind. You are starting. That is the only step that matters.",
        },
        reflection: "How well do you actually know the Bible, and what would it take to know it better?",
        prayer: "God,\n\nI have been carrying your word without knowing it.\nI have owned the sword without training with it.\n\nForgive the neglect. Not with guilt, but with hunger.\nGive me a desire for your text that is stronger than my desire for my feed.\n\nI want to know what you have said. Not vaguely. Specifically. Deeply. Accurately.\n\nTeach me to handle the word of truth.\n\nAmen.",
      },
      {
        num: 4,
        title: "Memorization as Training",
        stillness: "A soldier does not learn to use a sword on the battlefield. He learns in training. And he trains until the movement is reflex, not decision. Today you train.",
        scriptures: [
          { text: "I have hidden your word in my heart that I might not sin against you.", ref: "Psalm 119:11" },
          { text: "Let the word of Christ dwell in you richly.", ref: "Colossians 3:16" },
          { text: "These commandments that I give you today are to be on your hearts. Impress them on your children. Talk about them when you sit at home and when you walk along the road, when you lie down and when you get up.", ref: "Deuteronomy 6:6-7" },
        ],
        teaching: [
          "Memorization has fallen out of favor in the modern church, and the timing could not be worse.",
          "The argument against it usually sounds like this: \"I would rather understand the Bible than memorize it.\" \"I can always look it up.\" \"Memorization is rote; I want relationship.\" Each of these objections contains a grain of truth and misses the point entirely.",
          "You cannot wield a sword that is stored in a sheath on the other side of the room.",
          "When the arrow comes, it does not wait for you to open your Bible app, search for the right verse, and read it slowly. The arrow comes in the middle of a meeting. In the silence of 2 a.m. In the moment of temptation. In the spiral of anxiety. In the conversation where someone says something that strikes at your identity. The arrow comes fast. And the only defense that works at the speed of the attack is truth that is already in you.",
          "This is what Psalm 119:11 means by \"hidden in my heart.\" The word heart in Hebrew is leb, and it does not mean emotions. It means the seat of the will, the mind, the core of the person. To hide God's word in your heart is to internalize it so deeply that it becomes part of your operating system. The reflex that fires before the conscious decision. When the lie says, \"You are worthless,\" the word that is hidden in your heart fires back: \"I am God's handiwork, created in Christ Jesus.\" Not because you thought it through. Because it was already there.",
          "Colossians 3:16 says to let the word dwell in you richly. The word \"richly\" is plousios, which means abundantly, lavishly, without restraint. A mind furnished with truth. A storehouse of specific texts for specific situations. A library of promises, commands, and declarations that the Spirit can activate at the moment they are needed.",
          "Deuteronomy 6:6-7 gives the method. These words are to be on your hearts. Talk about them when you sit at home, when you walk along the road, when you lie down, when you get up. Total integration -- not fifteen minutes of study and then back to normal life. The word woven into the fabric of your day. This is how a verse moves from short-term memory into long-term identity: through repetition, through immersion, through daily, consistent, unremarkable practice.",
          "Memorization is training. The athlete who practices free throws a thousand times is not engaged in meaningless repetition. She is building muscle memory. She is training the movement so deeply into her body that when the game is on the line, the shot is reflex, not decision. Scripture memorization works the same way. You rehearse the verse until it lives in you. And then, when the moment comes, it fires."
        ],
        practice: {
          duration: "15 Minutes",
          body: "Review the verse you have been memorizing this week. Can you write it perfectly from memory? If not, keep working.\n\nNow add a second verse. Choose one that addresses a specific lie you identified in the Shield of Faith track. If your most common arrow is about your worth, memorize a verse about your identity. If your most common arrow is about the future, memorize a verse about God's sovereignty. Match the sword to the fight.\n\nWrite the new verse on a card. Carry it with you today. Read it aloud at least five times. Before bed tonight, try to recite both verses from memory.\n\nYou now have two swords. By the end of this track, you will have a system for adding more. One verse at a time. One week at a time. Over a year, fifty-two verses. Over five years, a mind furnished with truth.",
        },
        reflection: "What would change about your daily life if you had ten verses memorized and ready to deploy?",
        prayer: "God,\n\nI want your word in me, not just in front of me.\nNot on a shelf. Not in an app. In my heart. In my reflex. In the place where the arrows land.\n\nGive me the discipline to memorize.\nGive me the consistency to practice.\nGive me the hunger to keep going when it feels tedious.\n\nFill my mind with your truth until the truth is what fires first.\n\nAmen.",
      },
      {
        num: 5,
        title: "The Sword in Community",
        stillness: "The sword is personal, but it is not private. The word of God was given to a people, not just a person. Before you read, remember that you are part of a body. The sword works best when the body wields it together.",
        scriptures: [
          { text: "They devoted themselves to the apostles' teaching and to fellowship, to the breaking of bread and to prayer.", ref: "Acts 2:42" },
          { text: "Let the message of Christ dwell among you richly as you teach and admonish one another with all wisdom.", ref: "Colossians 3:16" },
          { text: "Iron sharpens iron, and one person sharpens another.", ref: "Proverbs 27:17" },
        ],
        teaching: [
          "The early church did not read Scripture alone.",
          "Acts 2:42 describes the first community of believers, and their four practices are listed in deliberate order. The apostles' teaching came first. Before fellowship, before communion, before prayer, there was the word -- not private devotional reading, but corporate teaching. The community gathered around the text together and let it shape them as a body.",
          "This matters because the modern church has largely privatized Scripture. Your \"quiet time\" is individual. Your Bible reading plan is personal. Your understanding of the text is shaped by your own interpretation, filtered through your own biases, applied to your own situation. Personal Bible reading is essential. It is also insufficient. A sword wielded in isolation can be wielded inaccurately. It takes a community to keep the blade straight.",
          "Colossians 3:16 adds the detail. Let the word dwell among you richly as you teach and admonish one another. This is the communal function of Scripture. You do not just read the word. You speak it to each other. You teach. You admonish, which means to correct with care. The word becomes a shared language, a communal tool, a sword that the body wields together.",
          "Proverbs 27:17 uses the image of iron sharpening iron. The sharpening happens through friction -- not conflict, but honest engagement. When you bring your understanding of a passage to a group and someone challenges your interpretation, the text gets sharper for both of you. When someone speaks a verse into your life that you did not know you needed, the sword cuts through something you could not have reached alone.",
          "Reading Scripture alone carries a specific risk: you are more likely to avoid the passages that convict you, to misapply the text, and to reinforce your existing beliefs rather than be challenged by the full counsel of Scripture. In community, the text is alive in a different way. It speaks through multiple voices. It confronts from multiple angles. It forms the body, not just the individual."
        ],
        practice: {
          duration: "15 Minutes",
          body: "This practice takes the sword into community.\n\nIdentify one person or one small group you can read Scripture with regularly. Not a Bible study that focuses on discussion questions about life application, although those have value. A practice of reading the text together, slowly, and discussing what it actually says before rushing to what it means for you.\n\nIf you already have a group, propose this: choose one short passage for the week. Everyone reads it daily. When you gather, share what stood out, what confused you, what convicted you, and what you think God is saying through the text. Keep it simple. Keep it in the text.\n\nIf you do not have a group, ask one person to read with you. One passage. One week. One conversation about what you found. The sword sharpens through shared use.",
        },
        reflection: "Who are you reading Scripture with, and how has their perspective sharpened yours?",
        prayer: "God,\n\nI do not want to wield the sword alone.\nI need the voices of others to sharpen my understanding, challenge my assumptions, and speak your word into the places I cannot reach on my own.\n\nGive me a community of the word.\nPeople who will read with me, teach me, admonish me, and help me handle your truth accurately.\n\nIron sharpens iron. Sharpen me through your people.\n\nAmen.",
      },
      {
        num: 6,
        title: "Weapons Training",
        stillness: "This is the final day. Not the final practice. This is the beginning of a lifetime of training with the word. What you build today is the system that sustains the discipline. Take your time. The sword is worth the investment.",
        scriptures: [
          { text: "Blessed is the one who does not walk in step with the wicked or stand in the way that sinners take or sit in the company of mockers, but whose delight is in the law of the Lord, and who meditates on his law day and night.", ref: "Psalm 1:1-2" },
          { text: "Your word is a lamp for my feet, a light on my path.", ref: "Psalm 119:105" },
          { text: "The grass withers and the flowers fall, but the word of our God endures forever.", ref: "Isaiah 40:8" },
        ],
        teaching: [
          "Psalm 1 opens the entire book of Psalms with a portrait of the person who thrives. And the defining characteristic of that person is not talent, discipline, success, or influence. It is meditation on the word. Day and night. Not once a week. Not in a crisis. Day and night.",
          "The word \"meditates\" is hagah, which means to mutter, to speak quietly, to turn over in the mouth. It is an oral practice. The blessed person does not just read the word. She speaks it. She chews on it. She returns to it throughout the day, letting it sit on her tongue, letting it reshape her thoughts, letting it become the background hum of her mental life.",
          "This is weapons training. The quiet, daily, unremarkable kind. Reading a chapter while drinking coffee. Reviewing a verse on the drive to work. Speaking a passage aloud before bed. It is the consistent, unglamorous discipline that builds a mind furnished with truth over years, not days.",
          "Psalm 119:105 describes the word as a lamp and a light. A lamp, specifically -- not a floodlight that illuminates everything at once. It shows the next step. It does not reveal the whole path. You do not need to understand the whole Bible to take the next step. You need the verse in front of you, applied to the moment you are in. The sword is not a searchlight. It is a blade. Precise, specific, and effective at close range.",
          "Isaiah 40:8 provides the long view. The grass withers. The flowers fall. The word endures forever. Every other formation system you encounter is temporary. The culture's values will shift. The algorithm will be replaced. The trends will change. The opinions will reverse. But the word of God stands. It stood before the internet. It will stand after the internet. It is the only formation resource that never becomes outdated, never loses its edge, and never runs out of power.",
          "A life built on the word is the single most durable investment a human being can make -- not because the Bible is a self-improvement manual, but because the word of God is alive, and it forms the person who handles it into someone who can stand in any storm, face any enemy, and speak the truth when everything else falls away.",
          "This track is six days. The training is for a lifetime. One verse per week. One chapter per day. One community reading the word together. Slowly, consistently, over years, the sword fills your hand and the truth fills your mind and the word does what it has always done: it endures, it cuts, it heals, it forms."
        ],
        practice: {
          duration: "20 Minutes",
          body: "Today you build your memorization system. This is your cumulative artifact for this track.\n\nStep one: Write down the verse you have memorized this week. If you have memorized two, write both.\n\nStep two: Choose your next four verses. Select them with intention. Choose verses that address the specific arrows you identified in the Shield of Faith track. Choose verses that reinforce the truths from the Belt of Truth, the Breastplate, the Gospel of Peace, and the Helmet. Build your arsenal with precision.\n\nWrite all five verses on a single page or card. This is your current weapons inventory.\n\nStep three: Commit to a weekly rhythm. One new verse per week. Daily review of all memorized verses. Write each new verse on Monday. Review daily. By Sunday, you should be able to recite it without looking.\n\nStep four: Tell one person. Show them your five verses. Tell them your weekly plan. Ask them to check in monthly and ask you to recite your most recent verses. This is not performance. It is training accountability. Every soldier trains with a partner.\n\nYou now have a system. One verse per week. Fifty-two verses per year. Over five years, two hundred and sixty verses. A mind furnished with the word of God. A hand that holds the sword with confidence. A reflex that responds to the enemy's lies with \"It is written.\"",
        },
        reflection: "What has God shown you about His word this week that you do not want to forget?",
        prayer: "God,\n\nThank you for the sword.\nThank you that your word is alive, that it endures, that it cuts through every lie the enemy has ever spoken.\n\nI commit to the training. Not for a week. For a lifetime.\nOne verse at a time. One day at a time. One step at a time.\n\nFill my mind with your truth until your truth is what fires first.\nGive me hunger for the text that outlasts every distraction.\n\nThe sword is in my hand. Teach me to use it well.\n\nAmen.",
      },
    ],
  },
};

export function ArmorStyles() {
  return (
    <style>{`
      .ap-wrap * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
      .ap-wrap   { font-family: 'Barlow Condensed', sans-serif; background: #06050A; color: #FAF8F5; min-height: 100svh; overflow-x: hidden; }

      /* Progress bar */
      .ap-back-nav { position: sticky; top: 0; z-index: 100; background: rgba(6,5,10,0.92); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255,255,255,0.06); padding: 10px 20px; display: flex; align-items: center; gap: 16px; }
      .ap-back-link { font-size: 9px; letter-spacing: 0.3em; text-transform: uppercase; color: rgba(250,248,245,0.35); text-decoration: none; transition: color 0.2s; flex-shrink: 0; }
      .ap-back-link:hover { color: #C9A84C; }
      .ap-piece-switcher { display: flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 999px; padding: 6px 14px 6px 10px; cursor: pointer; transition: border-color 0.2s; }
      .ap-piece-switcher:hover { border-color: rgba(201,168,76,0.3); }
      .ap-piece-switcher-num { font-size: 8px; letter-spacing: 0.28em; color: rgba(201,168,76,0.5); }
      .ap-piece-switcher-title { font-family: 'Barlow Condensed', sans-serif; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; font-weight: 700; color: #FAF8F5; }
      .ap-piece-dropdown { position: absolute; top: 100%; left: 50%; transform: translateX(-50%); background: #0E0C0A; border: 1px solid rgba(201,168,76,0.15); border-radius: 12px; padding: 8px; min-width: 260px; box-shadow: 0 12px 40px rgba(0,0,0,0.6); z-index: 200; }
      .ap-piece-dropdown-item { display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-radius: 8px; text-decoration: none; font-family: 'Barlow Condensed', sans-serif; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; font-weight: 700; color: rgba(250,248,245,0.3); transition: background 0.15s, color 0.15s; }
      .ap-piece-dropdown-item:hover { background: rgba(255,255,255,0.04); color: rgba(250,248,245,0.6); }
      .ap-piece-dropdown-item.active { color: #C9A84C; background: rgba(201,168,76,0.08); }
      .ap-piece-dropdown-num { font-size: 8px; letter-spacing: 0.28em; color: rgba(201,168,76,0.45); flex-shrink: 0; }

      /* Hero */
      .ap-hero { position: relative; overflow: hidden; min-height: clamp(35vh, 40vw, 55vh); display: flex; flex-direction: column; justify-content: flex-end; width: 100%; }
      .ap-hero-bg  { position: absolute; inset: 0; background-size: cover; background-position: center center; filter: grayscale(.2); }
      .ap-hero-ov  { position: absolute; inset: 0; background: linear-gradient(to top, rgba(6,5,10,0.97) 0%, rgba(6,5,10,0.45) 50%, rgba(6,5,10,0.1) 100%); }
      .ap-hero-icon { position: absolute; right: 4%; top: 50%; transform: translateY(-50%); width: clamp(100px, 20vw, 200px); height: clamp(100px, 20vw, 200px); opacity: 0.07; pointer-events: none; z-index: 1; }
      @media (min-width: 1024px) { .ap-hero-icon { width: clamp(160px, 18vw, 280px); height: clamp(160px, 18vw, 280px); } }
      .ap-hero-in  { position: relative; z-index: 2; padding: 2rem 24px 2.5rem; max-width: 860px; margin: 0 auto; width: 100%; }
      .ap-hero-eye { font-size: 10px; letter-spacing: .5em; text-transform: uppercase; color: #C9A84C; margin-bottom: .75rem; font-weight: 700; }
      .ap-hero-h1  { font-family: 'Michroma', sans-serif; font-size: clamp(36px, 8vw, 88px); text-transform: uppercase; letter-spacing: 0.1em; color: #FAF8F5; line-height: .9; margin-bottom: 1rem; }
      .ap-hero-sub { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: clamp(15px, 3vw, 20px); color: rgba(250,248,245,0.4); }

      /* Content grid */
      .ap-content { max-width: 800px; margin: 0 auto; padding: 44px 20px 100px; }

      /* Day selector */
      .ap-day-nav { display: flex; overflow-x: auto; gap: 4px; padding-bottom: 1px; margin-bottom: 2.5rem; border-bottom: 1px solid rgba(255,255,255,0.07); scrollbar-width: none; position: sticky; top: 46px; z-index: 50; background: #06050A; padding-top: 12px; box-shadow: 0 8px 24px rgba(6,5,10,0.95); }
      .ap-day-nav::-webkit-scrollbar { display: none; }
      .ap-day-btn { flex-shrink: 0; padding: 12px 20px; border: none; background: transparent; border-bottom: 2px solid transparent; cursor: pointer; font-family: 'Barlow Condensed', sans-serif; font-size: 11px; letter-spacing: .28em; text-transform: uppercase; color: rgba(250,248,245,0.28); transition: color .2s, border-color .2s; }
      .ap-day-btn.active { color: #C9A84C; border-bottom-color: #C9A84C; }
      .ap-day-btn:hover:not(.active) { color: rgba(250,248,245,0.55); }
      .ap-day-btn.completed::after { content: ''; display: block; width: 4px; height: 4px; border-radius: 50%; background: #C9A84C; margin: 4px auto 0; opacity: 0.6; }
      .ap-day-btn.active.completed::after { opacity: 1; }
      .ap-day-nav-icon { align-self: center; }

      /* Section labels */
      .ap-sec-label { font-size: 9px; letter-spacing: .45em; text-transform: uppercase; color: #C9A84C; margin-bottom: 1.25rem; padding-bottom: .75rem; border-bottom: 1px solid rgba(255,255,255,0.06); }

      /* Stillness */
      .ap-stillness { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: clamp(20px, 3.8vw, 22px); color: rgba(250,248,245,0.5); line-height: 1.8; margin-bottom: 2.5rem; padding-left: 1.25rem; border-left: 2px solid rgba(201,168,76,0.2); }

      /* Scripture */
      .ap-scriptures { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 2.5rem; }
      .ap-scripture  { background: rgba(255,255,255,0.025); border-left: 2px solid #C9A84C; border-radius: 0 12px 12px 0; padding: 1.25rem 1.5rem; overflow-wrap: break-word; word-break: break-word; }
      .ap-scripture p    { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: clamp(20px, 3.8vw, 22px); color: rgba(250,248,245,0.72); line-height: 1.7; margin-bottom: .5rem; overflow-wrap: break-word; word-break: break-word; }
      .ap-scripture cite { font-size: 9px; letter-spacing: .32em; text-transform: uppercase; color: #C9A84C; font-style: normal; }

      /* Teaching */
      .ap-teaching { margin-bottom: 2.5rem; }
      .ap-body { font-family: 'Cormorant Garamond', serif; font-size: clamp(20px, 3.8vw, 22px); line-height: 1.88; color: rgba(250,248,245,0.74); margin-bottom: 1.25rem; }

      /* Practice */
      .ap-practice { background: rgba(201,168,76,0.04); border: 1px solid rgba(201,168,76,0.15); border-radius: 18px; padding: 1.75rem; margin-bottom: 2.5rem; }
      .ap-practice-head { display: flex; align-items: center; gap: 12px; margin-bottom: 1.25rem; }
      .ap-practice-badge { font-size: 8px; letter-spacing: .28em; text-transform: uppercase; color: rgba(201,168,76,0.65); border: 1px solid rgba(201,168,76,0.25); border-radius: 999px; padding: 4px 12px; }
      .ap-practice-body { font-family: 'Cormorant Garamond', serif; font-size: clamp(20px, 3.5vw, 22px); line-height: 1.82; color: rgba(250,248,245,0.65); white-space: pre-line; }

      /* Reflection */
      .ap-reflection { background: rgba(201,168,76,0.04); border: 1px solid rgba(201,168,76,0.12); border-radius: 14px; padding: 1.5rem; margin-bottom: 2.5rem; font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: clamp(20px, 3.5vw, 22px); color: rgba(250,248,245,0.6); line-height: 1.7; }

      /* Prayer */
      .ap-prayer { background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.07); border-radius: 18px; padding: 2rem; margin-bottom: 2.5rem; font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: clamp(20px, 3.5vw, 22px); color: rgba(250,248,245,0.62); line-height: 1.9; white-space: pre-line; }

      /* Declare */
      .ap-declare { border-top: 1px solid rgba(255,255,255,0.06); padding-top: 2rem; margin-bottom: 2.5rem; text-align: center; }
      .ap-declare-label { font-size: 9px; letter-spacing: .42em; text-transform: uppercase; color: rgba(201,168,76,0.55); margin-bottom: 1rem; }
      .ap-declare-prompt { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: clamp(18px, 4vw, 24px); color: rgba(250,248,245,0.55); line-height: 1.6; }

      /* Divider */
      .ap-rule { height: 1px; background: linear-gradient(to right, #C9A84C, transparent); opacity: .2; margin: 2rem 0; }

      /* Sidebar */
      .ap-sidebar { margin-top: 2.5rem; }
      .ap-widget-placeholder { background: rgba(201,168,76,0.05); border: 1px dashed rgba(201,168,76,0.25); border-radius: 20px; padding: 2rem; margin-bottom: 2rem; }
      .ap-widget-label { font-size: 9px; letter-spacing: .4em; text-transform: uppercase; color: rgba(201,168,76,0.55); margin-bottom: .75rem; }
      .ap-widget-title { font-family: 'Barlow Condensed', sans-serif; font-size: 18px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: #FAF8F5; margin-bottom: .5rem; }
      .ap-widget-desc  { font-family: 'Cormorant Garamond', serif; font-size: 15px; color: rgba(250,248,245,0.4); line-height: 1.65; margin-bottom: 1rem; }
      .ap-widget-soon  { font-size: 8px; letter-spacing: .28em; text-transform: uppercase; color: rgba(250,248,245,0.2); }

      .ap-armor-nav { display: flex; flex-direction: column; gap: 6px; }
      .ap-armor-nav-label { font-size: 9px; letter-spacing: .4em; text-transform: uppercase; color: rgba(201,168,76,0.45); margin-bottom: .75rem; }
      .ap-armor-link { display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-radius: 10px; text-decoration: none; transition: background .2s; }
      .ap-armor-link:hover { background: rgba(255,255,255,0.04); }
      .ap-armor-link.active { background: rgba(201,168,76,0.08); }
      .ap-armor-link-num   { font-size: 8px; letter-spacing: .28em; color: rgba(201,168,76,0.45); flex-shrink: 0; }
      .ap-armor-link-title { font-size: 11px; letter-spacing: .12em; text-transform: uppercase; font-weight: 700; }
      .ap-armor-link.active .ap-armor-link-title { color: #C9A84C; }
      .ap-armor-link:not(.active) .ap-armor-link-title { color: rgba(250,248,245,0.3); }

      /* Bottom nav */
      .ap-piece-nav { display: flex; gap: 12px; margin-top: 3rem; padding-top: 2rem; border-top: 1px solid rgba(255,255,255,0.06); }
      .ap-nav-btn { flex: 1; min-height: 80px; padding: 20px 24px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.10); background: rgba(255,255,255,0.03); text-decoration: none; display: flex; flex-direction: row; align-items: center; gap: 20px; transition: border-color .25s, background .25s; }
      .ap-nav-btn:hover { border-color: rgba(201,168,76,0.4); background: rgba(201,168,76,0.05); }
      .ap-nav-btn-text  { display: flex; flex-direction: column; gap: 6px; }
      .ap-nav-btn-dir   { display: block; font-size: 12px; letter-spacing: .28em; text-transform: uppercase; color: rgba(201,168,76,0.7); }
      .ap-nav-btn-title { display: block; font-family: 'Michroma', sans-serif; font-size: clamp(14px, 1.8vw, 18px); text-transform: uppercase; letter-spacing: .06em; color: #FAF8F5; line-height: 1.2; }
      .ap-nav-btn.next  { flex-direction: row-reverse; text-align: right; }
      .ap-nav-btn.next .ap-nav-btn-text { align-items: flex-end; }

      /* Mobile */
      @media (max-width: 639px) {
        .ap-piece-nav { flex-direction: column; }
        .ap-nav-btn { width: 100%; flex: none; }
        .ap-nav-btn.next { text-align: right; flex-direction: row-reverse; }
        .ap-nav-btn.next .ap-nav-btn-text { align-items: flex-end; }
        .ap-content { padding: 32px 20px 120px; display: flex; flex-direction: column; }
        .ap-day-nav   { order: 0; top: 44px; padding-top: 8px; }
        .ap-sidebar   { order: 1; margin-top: 0; margin-bottom: 2rem; }
        .ap-main      { order: 2; max-width: 100%; }
        .ap-piece-nav { order: 3; }
        .ap-scripture { padding: 1rem 1.25rem; }
        .ap-piece-dropdown { left: 10px; right: 10px; transform: none; min-width: auto; }
        .ap-back-nav { padding: 8px 16px; gap: 10px; }
        .ap-piece-switcher-title { max-width: 140px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      }

      /* Tablet: sidebar appears ABOVE main content (between day tabs and devotional body) */
      @media (min-width: 640px) and (max-width: 1023px) {
        .ap-content { display: flex; flex-direction: column; }
        .ap-day-nav { order: 0; }
        .ap-sidebar { order: 1; margin-top: 0; margin-bottom: 2.5rem; }
        .ap-main    { order: 2; }
        .ap-piece-nav { order: 3; }
      }

      /* Desktop two-column layout */
      @media (min-width: 1024px) {
        .ap-hero-in  { max-width: 1100px; padding: 2.5rem 48px 3rem; }
        .ap-hero-h1  { font-size: clamp(60px, 8vw, 100px); }
        .ap-content  {
          max-width: 1100px; padding: 52px 48px 140px;
          display: grid;
          grid-template-columns: 1fr 320px;
          column-gap: 64px;
          align-items: start;
          grid-template-areas:
            "day-nav   day-nav"
            "main      sidebar"
            "piece-nav piece-nav";
        }
        .ap-day-nav   { grid-area: day-nav; }
        .ap-main      { grid-area: main; }
        .ap-sidebar   { grid-area: sidebar; position: sticky; top: 56px; align-self: start; border-left: 1px solid rgba(255,255,255,0.07); padding-left: 36px; margin-top: 0; display: flex; flex-direction: column; gap: 2rem; }
        .ap-piece-nav { grid-area: piece-nav; }
      }

      @media (min-width: 1440px) {
        .ap-hero-in { max-width: 1320px; padding: 3rem 64px 3.5rem; }
        .ap-content { max-width: 1320px; grid-template-columns: 1fr 360px; column-gap: 80px; padding: 60px 64px 160px; }
        .ap-sidebar { padding-left: 48px; }
      }
    `}</style>
  );
}

function BackNav({ progRef }) {
  const { piece } = useParams();
  const [open, setOpen] = useState(false);
  const current = ARMOR_TRACKS[piece];

  return (
    <div className="ap-back-nav">
      <Link to="/identity" className="ap-back-link">
        ← Identity
      </Link>
      <button
        className="ap-piece-switcher"
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
      >
        <span className="ap-piece-switcher-num">{current?.num}</span>
        <span className="ap-piece-switcher-title">{current?.title}</span>
        <ChevronDown size={12} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .2s", opacity: 0.4 }} />
      </button>

      {open && (
        <>
          <div
            onClick={() => setOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 199,
              background: "rgba(0,0,0,0.3)",
            }}
          />
          <div className="ap-piece-dropdown" style={{ zIndex: 200 }}>
            {PIECE_ORDER.map(slug => {
              const p = ARMOR_TRACKS[slug];
              const isActive = slug === piece;
              return (
                <Link
                  key={slug}
                  to={`/identity/${slug}`}
                  className={`ap-piece-dropdown-item${isActive ? " active" : ""}`}
                  onClick={() => setOpen(false)}
                >
                  <span className="ap-piece-dropdown-num">{p.num}</span>
                  <span>{p.title}</span>
                </Link>
              );
            })}
          </div>
        </>
      )}

      {/* Progress bar embedded at bottom edge */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "2px", background: "rgba(255,255,255,0.05)" }}>
        <div ref={progRef} style={{ height: "100%", width: "0%", background: "linear-gradient(to right, #C9A84C, rgba(201,168,76,0.35))", transition: "width .12s linear" }} />
      </div>
    </div>
  );
}

function HeroSection() {
  const sectionRef  = useRef(null);
  const eyebrowRef  = useRef(null);
  const headlineRef = useRef(null);
  const sublineRef  = useRef(null);
  const chevronRef  = useRef(null);
  const watermarkRef = useRef(null);
  const particleRef = useRef(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      // --- Initial states ---
      gsap.set([eyebrowRef.current, sublineRef.current, chevronRef.current], { opacity: 0, y: 20 });
      gsap.set(headlineRef.current, { opacity: 0, y: 20, scale: 0.97 });
      gsap.set(watermarkRef.current, { opacity: 0 });

      // --- Hero entrance timeline (page load, not scroll) ---
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.to(watermarkRef.current,  { opacity: 0.10, duration: 1.0 })
        .to(eyebrowRef.current,    { opacity: 1,    y: 0, duration: 0.5 }, "-=0.7")
        .fromTo(headlineRef.current,
          { opacity: 0, y: 20, scale: 0.97 },
          { opacity: 1, y: 0, scale: 1.0, duration: 0.7, ease: "power3.out" }, "-=0.3")
        .to(sublineRef.current,    { opacity: 0.55, y: 0, duration: 0.6 }, "+=0.1")
        .to(chevronRef.current,    { opacity: 0.6,  y: 0, duration: 0.5 }, "-=0.3");

      // --- Scroll indicator pulse: opacity 0.4 → 1.0 ---
      gsap.fromTo(chevronRef.current,
        { opacity: 0.4 },
        { opacity: 1.0, duration: 1.4, ease: "sine.inOut", repeat: -1, yoyo: true, delay: 1.8 }
      );
      gsap.to(chevronRef.current, {
        y: 8, duration: 1.4, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 1.8,
      });

      // --- Watermark parallax (scrub) ---
      gsap.to(watermarkRef.current, {
        yPercent: -30,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // --- Particle field drift ---
      if (particleRef.current) {
        gsap.to(particleRef.current, {
          y: -18,
          duration: 14,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }


    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center pt-16 md:pt-0"
      style={{ backgroundColor: C.heroBg }}
    >
      {/* Clipping wrapper for background layers — keeps overflow-hidden off the section itself to avoid iOS scroll trap */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Hero image — very low opacity atmospheric */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/Identity_wide.png')",
          backgroundSize: "cover",
          backgroundPosition: "center 20%",
          opacity: 0.18,
        }}
      />
      {/* Bottom-heavy gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to top, ${C.heroBg} 0%, ${C.heroBg}ee 30%, ${C.heroBg}88 60%, ${C.heroBg}22 100%)`,
        }}
      />

      {/* Shield watermark — off-center atmospheric, parallax */}
      <div
        ref={watermarkRef}
        className="absolute inset-0 flex items-center opacity-0"
        style={{ justifyContent: "flex-end", paddingRight: "8%" }}
      >
        <img
          src="/shield-white.png"
          alt=""
          style={{
            height: "clamp(28vw, 45vh, 45vh)",
            width: "auto",
            filter: "brightness(0) invert(1)",
          }}
        />
      </div>

      {/* Particle field — CSS radial-gradient dots */}
      <div
        ref={particleRef}
        className="absolute inset-0 pointer-events-none"
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
      </div>{/* end background clipping wrapper */}

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
          className="font-brand uppercase tracking-[0.06em] md:tracking-[0.14em] text-white leading-none mb-8 opacity-0"
          style={{ fontSize: "clamp(1.8rem, 7vw, 5rem)" }}
        >
          You Are Being Formed
        </h1>
        <p
          ref={sublineRef}
          className="leading-relaxed max-w-2xl opacity-0"
          style={{
            fontSize: "clamp(0.95rem, 2.5vw, 1.3rem)",
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
  const sectionRef    = useRef(null);
  const eyebrowBRef   = useRef(null);
  const scriptureBRef = useRef(null);
  const rightColRef   = useRef(null);
  const goldRuleRef   = useRef(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    let ctx;
    const raf = requestAnimationFrame(() => {
    ctx = gsap.context(() => {
      // --- Left column: eyebrow + scripture ---
      if (eyebrowBRef.current) {
        gsap.fromTo(eyebrowBRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power2.out",
            scrollTrigger: { trigger: eyebrowBRef.current, start: "top 85%", toggleActions: "play none none reverse" } });
      }
      if (scriptureBRef.current) {
        gsap.fromTo(scriptureBRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.0, ease: "power2.out", delay: 0.2,
            scrollTrigger: { trigger: eyebrowBRef.current, start: "top 85%", toggleActions: "play none none reverse" } });
      }

      // --- Right column entrance: +300ms after left ---
      if (rightColRef.current) {
        gsap.fromTo(rightColRef.current,
          { y: 25, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, ease: "power2.out", delay: 0.3,
            scrollTrigger: { trigger: eyebrowBRef.current, start: "top 85%", toggleActions: "play none none reverse" } });
      }

      // --- Gold rule scaleX ---
      if (goldRuleRef.current) {
        gsap.set(goldRuleRef.current, { scaleX: 0, transformOrigin: "left center" });
        gsap.to(goldRuleRef.current, {
          scaleX: 1, duration: 0.8, ease: "power2.out",
          scrollTrigger: { trigger: goldRuleRef.current, start: "top 85%", toggleActions: "play none none reverse" },
        });
      }

      // --- Teaching paragraphs: batch stagger ---
      gsap.set(".armor-para", { opacity: 0 });
      ScrollTrigger.batch(".armor-para", {
        start: "top 88%",
        onEnter: batch => gsap.fromTo(batch,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power2.out", overwrite: "auto" }),
        onLeaveBack: batch => gsap.to(batch, { opacity: 0, y: 15, duration: 0.4, overwrite: "auto" }),
      });
    }, sectionRef);
    }); // end requestAnimationFrame
    return () => { cancelAnimationFrame(raf); ctx?.revert(); };
  }, []);

  return (
    <section id="scripture" ref={sectionRef} className="py-24 md:py-40 px-5" style={{ backgroundColor: C.heroBg }}>
      <div className="max-w-[1100px] mx-auto">
        <div className="grid md:grid-cols-[55fr_45fr] gap-16 md:gap-24 items-start">

          {/* LEFT: Scripture */}
          <div>
            <span
              ref={eyebrowBRef}
              className="block text-[10px] tracking-[0.5em] uppercase font-bold mb-8"
              style={{ color: C.gold }}
            >
              Ephesians 6:10–18
            </span>
            <blockquote
              ref={scriptureBRef}
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: "italic",
                fontSize: "clamp(17px, 1.9vw, 24px)",
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
          </div>

          {/* RIGHT: Pull quote + teaching */}
          <div ref={rightColRef}>
            <div
              ref={goldRuleRef}
              className="h-[1px] mb-10"
              style={{ background: `linear-gradient(to right, ${C.gold}55, transparent)` }}
            />
            <p
              className="armor-para mb-10"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: "italic",
                fontSize: "clamp(20px, 2.2vw, 28px)",
                lineHeight: 1.55,
                color: `${C.ivory}bb`,
              }}
            >
              The armor is not something you build. It is something you receive and put on.
            </p>
            <div className="space-y-8">
              <p className="armor-para text-sm md:text-base leading-relaxed font-light" style={{ color: `${C.ivory}99` }}>
                Paul is writing to people under real pressure — not offering a metaphor for self-improvement but a survival framework for people living inside a hostile formation system. Rome's empire was total: emperor worship, cultural assimilation, a comprehensive narrative about power, identity, and worth. The parallel to the modern formation environment is not metaphorical. It is structural.
              </p>
              <p className="armor-para text-sm md:text-base leading-relaxed font-light" style={{ color: `${C.ivory}99` }}>
                Identity in Christ is given, not constructed. The belt, the breastplate, the shield — each piece represents a dimension of God's own character that He extends to those who are in Christ. You are not assembling virtue through effort. You are stepping into what has already been provided.
              </p>
              <p className="armor-para text-sm md:text-base leading-relaxed font-light" style={{ color: `${C.ivory}99` }}>
                "Putting on" is a daily, deliberate act. You drift without it by default. The armor does not go on automatically — it requires intentional return, morning by morning, to the reality of who you are in Christ before the world has a chance to tell you otherwise. That is why this collection pairs every piece with a formation pathway.
              </p>
            </div>
          </div>

        </div>

        <div className="mt-20 flex justify-center pointer-events-none">
          <img
            src="/helmet.png"
            alt=""
            style={{ height: "200px", filter: "brightness(0) invert(1)", opacity: 0.06 }}
          />
        </div>
      </div>
    </section>
  );
}

function GodsArmorSection() {
  const sectionRef = useRef(null);
  const leftColRef = useRef(null);
  const rightColRef = useRef(null);
  const brandLineRef = useRef(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    let ctx;
    const raf = requestAnimationFrame(() => {
    ctx = gsap.context(() => {
      // --- Left column entrance ---
      if (leftColRef.current) {
        gsap.fromTo(leftColRef.current,
          { y: 25, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, ease: "power2.out",
            scrollTrigger: { trigger: leftColRef.current, start: "top 80%", toggleActions: "play none none reverse" } });
      }

      // --- Right column entrance: +300ms delay ---
      if (rightColRef.current) {
        gsap.fromTo(rightColRef.current,
          { y: 25, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, ease: "power2.out", delay: 0.3,
            scrollTrigger: { trigger: leftColRef.current, start: "top 80%", toggleActions: "play none none reverse" } });
      }

      // --- Brand line gold glow dissipation ---
      if (brandLineRef.current) {
        gsap.fromTo(brandLineRef.current,
          { opacity: 0, scale: 1.03 },
          { opacity: 1, scale: 1.0, duration: 1.0, ease: "power2.out",
            scrollTrigger: { trigger: brandLineRef.current, start: "top 85%", toggleActions: "play none none reverse" },
            onComplete: () => {
              gsap.fromTo(brandLineRef.current,
                { textShadow: "0 0 20px rgba(201,168,76,0.4)" },
                { textShadow: "0 0 0px rgba(201,168,76,0)", duration: 2.0, ease: "power2.out" });
            },
          });
      }

      // --- Background color transition: Hero Black → Rule Brown via scrub ---
      gsap.fromTo(sectionRef.current,
        { backgroundColor: C.heroBg },
        { backgroundColor: C.ruleBg, ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
        });
    }, sectionRef);
    }); // end requestAnimationFrame
    return () => { cancelAnimationFrame(raf); ctx?.revert(); };
  }, []);

  return (
    <section
      id="revelation"
      ref={sectionRef}
      className="py-24 md:py-40 px-5"
      style={{ backgroundColor: C.heroBg }}
    >
      <div className="max-w-[1100px] mx-auto">
        <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-start">

          <div ref={leftColRef}>
            <span
              className="block text-[10px] tracking-[0.5em] uppercase font-bold mb-8"
              style={{ color: C.gold }}
            >
              The Revelation
            </span>
            <p className="text-sm md:text-base leading-relaxed font-light mb-6" style={{ color: `${C.ivory}77` }}>
              The armor Paul describes is not a metaphor invented for the church. It is drawn from Isaiah's descriptions of God Himself. Isaiah 59:17 describes God putting on righteousness as a breastplate, salvation as a helmet. Isaiah 11:5 pictures the belt of faithfulness. Isaiah 52:7 speaks of feet bringing good news of peace.
            </p>
            <p className="text-sm md:text-base leading-relaxed font-light mb-12" style={{ color: `${C.ivory}77` }}>
              When you put on the armor of God, you are not assembling your own defenses. You are stepping into God's own character — the same righteousness, the same salvation, the same peace that belong to Him. The armor is His before it is yours.
            </p>
            <p
              ref={brandLineRef}
              className="text-lg md:text-2xl tracking-[0.12em] uppercase font-bold leading-tight"
              style={{ fontFamily: "'Michroma', sans-serif", color: C.gold }}
            >
              "You are not inventing identity. You are receiving it."
            </p>
          </div>

          <div ref={rightColRef}>
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

function ArmorRingSection() {
  const sectionRef    = useRef(null);
  const ringRef       = useRef(null);
  const centerRef     = useRef(null);
  const imageRef      = useRef(null);
  const contentRef    = useRef(null);
  const [activePiece, setActivePiece]         = useState(null);
  const [hasEntered, setHasEntered]           = useState(false);
  const [hasEverSelected, setHasEverSelected] = useState(false);
  const iconRefs   = useRef([]);
  const prevPieceRef = useRef(null);
  const [prefersReduced] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  const RING_ANGLES = [0, 60, 120, 180, 240, 300];
  const toRad  = (deg) => (deg * Math.PI) / 180;
  const ICON_R = 42;
  const getPos = (deg, r) => ({
    x: 50 + r * Math.sin(toRad(deg)),
    y: 50 - r * Math.cos(toRad(deg)),
  });

  /* ── Entry observer ── */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !hasEntered) { setHasEntered(true); observer.disconnect(); } },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasEntered]);

  /* ── Entry animation ── */
  useEffect(() => {
    if (!hasEntered || !ringRef.current) return;
    const reduced = prefersReduced;
    const ctx = gsap.context(() => {
      const svgCircle = ringRef.current.querySelector(".ring-arc");
      if (svgCircle && !reduced) {
        const circ = 2 * Math.PI * ICON_R;
        gsap.set(svgCircle, { strokeDasharray: circ, strokeDashoffset: circ });
        gsap.to(svgCircle, { strokeDashoffset: 0, duration: 1.2, ease: "power2.inOut" });
      }
      iconRefs.current.forEach((icon, i) => {
        if (!icon) return;
        if (reduced) { gsap.set(icon, { xPercent: -50, yPercent: -50, opacity: 1, scale: 1 }); return; }
        gsap.set(icon, { xPercent: -50, yPercent: -50, opacity: 0, scale: 0.8 });
        gsap.to(icon, { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.4)", delay: 1.0 + i * 0.1 });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [hasEntered, prefersReduced]);

  /* ── Icon scale/opacity on selection ── */
  useEffect(() => {
    if (!hasEntered) return;
    if (activePiece === null && prevPieceRef.current === null) return;
    iconRefs.current.forEach((icon, i) => {
      if (!icon) return;
      if (activePiece === null) {
        gsap.to(icon, { scale: 1, opacity: 1, duration: 0.3, ease: "power2.out" });
      } else if (i === activePiece) {
        gsap.to(icon, { scale: 1.2, opacity: 1, duration: 0.4, ease: "power2.out" });
      } else {
        gsap.to(icon, { scale: 0.85, opacity: 0.15, duration: 0.4, ease: "power2.out" });
      }
    });
  }, [activePiece, hasEntered]);

  /* ── Image crossfade ── */
  useEffect(() => {
    if (!imageRef.current) return;
    if (activePiece === null) {
      gsap.to(imageRef.current, { opacity: 0, duration: 0.4, ease: "power2.out" });
    } else {
      // If switching pieces: dip out briefly, src already updated, fade in
      if (prevPieceRef.current !== null) {
        gsap.fromTo(imageRef.current,
          { opacity: 0 },
          { opacity: 0.72, duration: 0.5, ease: "power2.out" }
        );
      } else {
        // First selection: bloom in
        gsap.fromTo(imageRef.current,
          { opacity: 0 },
          { opacity: 0.72, duration: 0.8, ease: "power2.out" }
        );
      }
    }
  }, [activePiece]);

  /* ── Center name crossfade ── */
  useEffect(() => {
    if (!centerRef.current) return;
    gsap.fromTo(centerRef.current,
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 0.35, ease: "power2.out" }
    );
  }, [activePiece]);

  /* ── Right column content fade ── */
  useEffect(() => {
    if (!contentRef.current) return;
    if (activePiece === null) {
      gsap.to(contentRef.current, { opacity: 0, y: 8, duration: 0.25, ease: "power2.in" });
    } else {
      gsap.fromTo(contentRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.45, ease: "power2.out", delay: 0.1 }
      );
    }
  }, [activePiece]);

  /* ── Selection handler ── */
  const handleSelect = (idx) => {
    if (idx === activePiece) {
      prevPieceRef.current = activePiece;
      setActivePiece(null);
    } else {
      const wasNull = activePiece === null;
      if (!hasEverSelected) setHasEverSelected(true);
      prevPieceRef.current = activePiece;
      if (!wasNull && contentRef.current) {
        gsap.to(contentRef.current, {
          opacity: 0, y: 8, duration: 0.18, ease: "power2.in",
          onComplete: () => setActivePiece(idx),
        });
      } else {
        setActivePiece(idx);
      }
    }
  };

  const piece = activePiece !== null ? ARMOR_PIECES[activePiece] : null;

  return (
    <section id="six-pieces" ref={sectionRef} className="py-24 md:py-40 px-5" style={{ backgroundColor: C.ruleBg }}>
      <style>{`
        @keyframes ringRotate {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes centerGlow {
          0%, 100% { opacity: 0.4; }
          50%      { opacity: 1; }
        }
        @keyframes haloPulse {
          0%, 100% { opacity: 0.25; transform: scale(1); }
          50%      { opacity: 0.55; transform: scale(1.06); }
        }
        @keyframes particleDriftA {
          from { transform: translate(-0.8px, -0.5px); }
          to   { transform: translate(0.8px, 0.5px); }
        }
        @keyframes particleDriftB {
          from { transform: translate(0.5px, -0.8px); }
          to   { transform: translate(-0.5px, 0.8px); }
        }
        @media (max-width: 767px) {
          .armor-ring-tile {
            width: 100vw !important;
            min-height: 80svh !important;
            border-radius: 0 !important;
            margin-left: -20px !important;
            align-self: stretch !important;
          }
        }
      `}</style>

      <div className="max-w-[1200px] mx-auto">

        {/* Section header */}
        <div className="mb-12 md:mb-16">
          <span className="block text-[10px] tracking-[0.5em] uppercase font-bold mb-4" style={{ color: C.gold }}>
            The Six Pieces
          </span>
          <h2 className="font-brand text-3xl md:text-6xl uppercase tracking-[0.1em] text-white leading-none">
            The Armor of God
          </h2>
        </div>

        {/* Side-by-side grid */}
        <div className="flex flex-col md:flex-row gap-0 md:gap-12 items-stretch">

          {/* LEFT: Ring column with atmospheric image */}
          <div
            className="armor-ring-tile relative flex-shrink-0 flex items-center justify-center"
            style={{
              width: "clamp(280px, 42vw, 520px)",
              minHeight: "clamp(280px, 42vw, 520px)",
              borderRadius: "1.5rem",
              overflow: "hidden",
              background: C.heroBg,
              alignSelf: "flex-start",
              margin: "0 auto",
            }}
          >
            {/* Atmospheric hero image — blooms in on selection */}
            <img
              ref={imageRef}
              src={piece ? (ARMOR_TRACKS[piece.slug]?.img || "") : ""}
              alt=""
              style={{
                position: "absolute", inset: 0,
                width: "100%", height: "100%",
                objectFit: "cover", objectPosition: "center top",
                opacity: 0,
                pointerEvents: "none",
              }}
            />
            {/* Radial overlay — darkens edges, keeps center readable */}
            <div style={{
              position: "absolute", inset: 0,
              background: `radial-gradient(ellipse at center, ${C.heroBg}33 0%, ${C.heroBg}88 60%, ${C.heroBg}CC 100%)`,
              pointerEvents: "none",
              zIndex: 1,
            }} />

            {/* Ring SVG */}
            <div
              ref={ringRef}
              style={{
                position: "relative",
                width: "clamp(300px, 70vw, 460px)",
                height: "clamp(300px, 70vw, 460px)",
                zIndex: 2,
              }}
            >
              <svg
                viewBox="0 0 100 100"
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}
              >
                {/* Rotating group: arc + particles */}
                <g style={{
                  transformOrigin: "50px 50px",
                  animation: prefersReduced ? "none" : "ringRotate 60s linear infinite",
                }}>
                  <circle
                    className="ring-arc"
                    cx="50" cy="50" r={ICON_R}
                    fill="none"
                    stroke={C.gold}
                    strokeOpacity="0.15"
                    strokeWidth="0.4"
                  />
                  {RING_ANGLES.map((angle, segIdx) => {
                    const midAngle = angle + 30;
                    const p1 = getPos(midAngle - 8, ICON_R);
                    const p2 = getPos(midAngle + 8, ICON_R);
                    const anim = segIdx % 2 === 0
                      ? "particleDriftA 4s ease-in-out infinite alternate"
                      : "particleDriftB 5s ease-in-out infinite alternate";
                    return (
                      <g key={segIdx}>
                        <circle cx={p1.x} cy={p1.y} r="0.35" fill={C.gold} opacity="0.08"
                          style={{ animation: prefersReduced ? "none" : anim }} />
                        <circle cx={p2.x} cy={p2.y} r="0.35" fill={C.gold} opacity="0.06"
                          style={{ animation: prefersReduced ? "none" : anim }} />
                      </g>
                    );
                  })}
                </g>
              </svg>

              {/* Center radial glow */}
              <div style={{
                position: "absolute", top: "50%", left: "50%",
                transform: "translate(-50%, -50%)",
                width: "45%", height: "45%",
                borderRadius: "50%",
                background: `radial-gradient(circle, ${C.gold}22 0%, transparent 70%)`,
                animation: prefersReduced ? "none" : "centerGlow 3s ease-in-out infinite",
                pointerEvents: "none",
              }} />

              {/* Center content — name only */}
              <div
                ref={centerRef}
                style={{
                  position: "absolute", top: "50%", left: "50%",
                  transform: "translate(-50%, -50%)",
                  textAlign: "center",
                  width: "52%",
                  pointerEvents: "none",
                }}
              >
                {piece ? (
                  <span style={{
                    fontFamily: "'Michroma', sans-serif",
                    fontSize: "clamp(16px, 1.6vw, 20px)",
                    color: C.gold,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    lineHeight: 1.3,
                  }}>
                    {piece.title}
                  </span>
                ) : (
                  <>
                    <img
                      src="/shield-white.png"
                      alt=""
                      style={{
                        width: "clamp(156px, 15vw, 204px)", height: "auto",
                        objectFit: "contain", opacity: 0.55,
                        display: "block", margin: "0 auto 0.75rem",
                      }}
                    />
                    <span style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontStyle: "italic",
                      fontSize: "clamp(26px, 2.8vw, 36px)",
                      color: C.gold,
                      opacity: 0.9,
                    }}>
                      Armor Up.
                    </span>
                  </>
                )}
              </div>

              {/* Six icon buttons */}
              {ARMOR_PIECES.map((p, i) => {
                const pos = getPos(RING_ANGLES[i], ICON_R);
                const isActive = activePiece === i;
                return (
                  <div
                    key={p.slug}
                    ref={el => { iconRefs.current[i] = el; }}
                    role="button"
                    tabIndex={0}
                    aria-label={p.title}
                    aria-pressed={isActive}
                    onClick={() => handleSelect(i)}
                    onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleSelect(i); } }}
                    style={{
                      position: "absolute",
                      left: `${pos.x}%`, top: `${pos.y}%`,
                      display: "flex", flexDirection: "column", alignItems: "center",
                      cursor: "pointer",
                      opacity: 0,
                      zIndex: 3,
                      outline: "none",
                      userSelect: "none",
                    }}
                  >
                    {isActive && (
                      <div style={{
                        position: "absolute", inset: "-8px",
                        borderRadius: "50%",
                        border: `1px solid ${C.gold}`,
                        animation: prefersReduced ? "none" : "haloPulse 1.5s ease-in-out infinite",
                        pointerEvents: "none",
                      }} />
                    )}
                    <img
                      src={p.icon}
                      alt={p.title}
                      style={{
                        width: "clamp(52px, 5.5vw, 76px)", height: "clamp(52px, 5.5vw, 76px)",
                        objectFit: "contain",
                        opacity: isActive ? 1 : 0.65,
                        filter: isActive ? `drop-shadow(0 0 8px ${C.gold}88)` : "none",
                        transition: "opacity 0.3s ease, filter 0.3s ease",
                      }}
                    />
                  </div>
                );
              })}
            </div>

            {/* "Tap a piece to begin" hint — over the ring */}
            {!hasEverSelected && (
              <p style={{
                position: "absolute", bottom: "1.5rem", left: 0, right: 0,
                textAlign: "center",
                fontSize: "10px",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: `${C.ivory}33`,
                fontFamily: "'Michroma', sans-serif",
                zIndex: 4,
                pointerEvents: "none",
              }}>
                Tap a piece to begin
              </p>
            )}
          </div>

          {/* RIGHT: Content panel */}
          <div
            className="flex-1 flex items-center"
            style={{ minHeight: "clamp(280px, 42vw, 520px)" }}
          >
            {piece ? (
              <div ref={contentRef} style={{ width: "100%", opacity: 0 }}>
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-[11px] tracking-[0.4em] uppercase" style={{ color: `${C.gold}77` }}>
                    {piece.num}
                  </span>
                  <div className="h-[1px] flex-1" style={{ background: `${C.gold}22` }} />
                </div>
                <h3 className="font-brand text-2xl md:text-4xl uppercase tracking-[0.1em] text-white mb-3">
                  {piece.title}
                </h3>
                <p className="text-[12px] tracking-[0.3em] uppercase mb-8" style={{ color: `${C.gold}99` }}>
                  <ScriptureRef reference={piece.scripture} text={piece.scriptureText} />
                </p>

                <div className="space-y-7">
                  <div>
                    <span className="text-[11px] tracking-[0.3em] uppercase block mb-2" style={{ color: `${C.ivory}55` }}>
                      Theology
                    </span>
                    <p className="text-base md:text-lg leading-relaxed font-light" style={{ color: `${C.ivory}88` }}>
                      {piece.theology}
                    </p>
                  </div>
                  <div>
                    <span className="text-[11px] tracking-[0.3em] uppercase block mb-2" style={{ color: `${C.ivory}55` }}>
                      Modern Tension
                    </span>
                    <p className="text-base md:text-lg leading-relaxed font-light" style={{ color: `${C.ivory}66` }}>
                      {piece.tension}
                    </p>
                  </div>
                  <div>
                    <span className="text-[11px] tracking-[0.3em] uppercase block mb-2" style={{ color: `${C.ivory}55` }}>
                      Daily Practice
                    </span>
                    <p className="text-base md:text-lg leading-relaxed font-light" style={{ color: `${C.ivory}77` }}>
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
                    fontSize: "clamp(17px, 1.6vw, 22px)",
                    color: `${C.ivory}99`,
                  }}
                >
                  "{piece.hook}"
                </blockquote>

                <div className="mt-8 flex items-center gap-5">
                  <Link
                    to={`/identity/${piece.slug}`}
                    className="text-[12px] tracking-[0.28em] uppercase font-bold flex items-center gap-2 transition-opacity hover:opacity-100"
                    style={{ color: C.gold, textDecoration: "none" }}
                  >
                    Explore this piece
                    <ArrowRight size={14} />
                  </Link>
                  {piece.product && (
                    <span className="text-[11px] tracking-[0.24em] uppercase" style={{ color: `${C.ivory}44` }}>
                      {piece.product}
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: "italic",
                fontSize: "clamp(16px, 1.8vw, 22px)",
                color: `${C.ivory}22`,
                lineHeight: 1.6,
              }}>
                Select a piece from the ring to explore its theology, tension, and daily practice.
              </p>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}

function ClosingSection() {
  const sectionRef = useRef(null);
  const pivotRef = useRef(null);
  const armorUpRef = useRef(null);
  const ctaRef = useRef(null);
  const scriptureRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let ctx;
    const raf = requestAnimationFrame(() => {
    ctx = gsap.context(() => {
      // Prose paragraphs — batch stagger
      gsap.set(".closing-para", { opacity: 0 });
      ScrollTrigger.batch(".closing-para", {
        start: "top 88%",
        onEnter: batch => gsap.fromTo(batch,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power2.out", overwrite: "auto" }),
        onLeaveBack: batch => gsap.to(batch,
          { opacity: 0, y: 15, duration: 0.4, overwrite: "auto" }),
      });

      // Gold pivot line — entrance + glow dissipation
      if (pivotRef.current) {
        gsap.fromTo(pivotRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.9, ease: "power2.out",
            scrollTrigger: { trigger: pivotRef.current, start: "top 88%", toggleActions: "play none none reverse" },
            onComplete: () => {
              gsap.fromTo(pivotRef.current,
                { textShadow: "0 0 20px rgba(201,168,76,0.4)" },
                { textShadow: "0 0 0px rgba(201,168,76,0)", duration: 2.0, ease: "power2.out" });
            },
          });
      }

      // "Armor Up." — scale entrance
      if (armorUpRef.current) {
        gsap.fromTo(armorUpRef.current,
          { opacity: 0, scale: 0.95 },
          { opacity: 1, scale: 1, duration: 0.9, ease: "power2.out",
            scrollTrigger: { trigger: armorUpRef.current, start: "top 85%", toggleActions: "play none none reverse" } });
      }

      // CTAs — stagger
      if (ctaRef.current) {
        const buttons = ctaRef.current.querySelectorAll("a, button");
        gsap.set(buttons, { opacity: 0, y: 12 });
        gsap.to(buttons, {
          opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: "power2.out",
          scrollTrigger: { trigger: ctaRef.current, start: "top 85%", toggleActions: "play none none reverse" },
        });
      }

      // Closing scripture + mark
      if (scriptureRef.current) {
        gsap.fromTo(scriptureRef.current,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power2.out",
            scrollTrigger: { trigger: scriptureRef.current, start: "top 90%", toggleActions: "play none none reverse" } });
      }
    }, sectionRef);
    }); // end requestAnimationFrame
    return () => { cancelAnimationFrame(raf); ctx?.revert(); };
  }, []);

  return (
    <section
      id="why"
      ref={sectionRef}
      className="px-5"
      style={{ backgroundColor: C.ruleBg }}
    >
      {/* ── Part 1: Why the Armor (prose) ── */}
      <div className="max-w-[740px] mx-auto pt-24 md:pt-40">
        <span
          className="closing-para block text-[10px] tracking-[0.5em] uppercase font-bold mb-8"
          style={{ color: C.gold }}
        >
          Why the Armor
        </span>
        <div className="space-y-8">
          <p className="closing-para text-sm md:text-base leading-relaxed font-light" style={{ color: `${C.ivory}77` }}>
            The armor is not a costume. It is what God has provided for people who are being formed in a system that is actively working against them. Every culture in history has had a comprehensive formation project — a set of values, narratives, and practices designed to shape people into its image. The digital age is no different, except that its reach is total and its pace is unprecedented.
          </p>
          <p className="closing-para text-sm md:text-base leading-relaxed font-light" style={{ color: `${C.ivory}77` }}>
            The gear is not the armor. It is a marker — a daily reminder that you belong to a different formation project. The QR code connects to the formation content: the theology, the practice, the community. The garment anchors the identity. The content forms it.
          </p>
          <p className="closing-para text-sm md:text-base leading-relaxed font-light" style={{ color: `${C.ivory}77` }}>
            The gear is the entry point. The content is the formation. The practice is the armor. These three move together, or they don't move at all.
          </p>
        </div>

        {/* Gold pivot line */}
        <p
          ref={pivotRef}
          className="mt-16 text-lg md:text-2xl tracking-[0.14em] uppercase font-bold leading-tight"
          style={{ fontFamily: "'Michroma', sans-serif", color: C.gold }}
        >
          "The gear is not the mission. It's a marker of it."
        </p>
      </div>

      {/* ── Part 2: Armor Up declaration + CTAs ── */}
      <div id="collection" className="max-w-[740px] mx-auto text-center pt-20 md:pt-28">
        {/* Thin gold rule — visual bridge between prose and declaration */}
        <div
          className="mx-auto mb-16 md:mb-20"
          style={{
            width: "48px",
            height: "1px",
            background: `linear-gradient(to right, transparent, ${C.gold}55, transparent)`,
          }}
        />

        {/* "Armor Up." campaign mark */}
        <p
          ref={armorUpRef}
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            fontSize: "clamp(32px, 6vw, 56px)",
            color: C.gold,
            lineHeight: 1.2,
            marginBottom: "1.5rem",
          }}
        >
          Armor Up.
        </p>

        {/* Bridge copy */}
        <p
          className="closing-para"
          style={{
            fontSize: "clamp(13px, 2vw, 16px)",
            color: "rgba(250,248,245,0.35)",
            lineHeight: 1.8,
            maxWidth: "480px",
            margin: "0 auto 2.5rem",
            letterSpacing: "0.02em",
          }}
        >
          Three hero pieces. Six formation tracks. Every garment connects to a devotional pathway through the QR code on the back.
        </p>

        {/* Dual CTAs */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
          <a
            href="/#shop"
            className="inline-flex items-center justify-center gap-3 px-9 py-3 rounded-full font-bold text-[10px] tracking-[0.28em] uppercase transition-all hover:scale-105 w-full sm:w-auto"
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              backgroundColor: C.gold,
              color: "#0A0A0A",
              boxShadow: `0 4px 24px ${C.gold}44`,
              textDecoration: "none",
            }}
          >
            Shop the Collection
          </a>
          <Link
            to="/identity/belt-of-truth"
            className="inline-flex items-center justify-center gap-3 px-9 py-3 rounded-full font-bold text-[10px] tracking-[0.28em] uppercase transition-all hover:bg-white/5 w-full sm:w-auto"
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              color: C.gold,
              border: `1px solid ${C.gold}44`,
              textDecoration: "none",
            }}
          >
            Begin Formation
          </Link>
        </div>

        {/* 7-Day Challenge soft link */}
        <Link
          to="/7-day-challenge"
          className="closing-para"
          style={{
            fontSize: "13px",
            color: "rgba(250,248,245,0.3)",
            textDecoration: "none",
            display: "inline-block",
            marginBottom: "3rem",
            transition: "color 0.2s",
          }}
          onMouseEnter={e => { e.currentTarget.style.color = "rgba(250,248,245,0.6)"; }}
          onMouseLeave={e => { e.currentTarget.style.color = "rgba(250,248,245,0.3)"; }}
        >
          New to Counter Formation? Start with the 7-Day Challenge →
        </Link>
      </div>

      {/* ── Part 3: Closing scripture + brand mark ── */}
      <div
        id="begin"
        ref={scriptureRef}
        className="max-w-[740px] mx-auto text-center pb-24 md:pb-40"
      >
        {/* Thin rule */}
        <div
          className="mx-auto mb-12"
          style={{
            width: "32px",
            height: "1px",
            background: `${C.gold}22`,
          }}
        />

        <p
          className="text-base md:text-lg leading-relaxed mb-3"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            color: `${C.ivory}44`,
          }}
        >
          "Be strong in the Lord and in his mighty power. Put on the full armor of God."
        </p>
        <p
          className="text-[9px] tracking-[0.4em] uppercase mb-12"
          style={{ color: `${C.ivory}25` }}
        >
          Ephesians 6:10–11
        </p>

        <img
          src="/helmet.png"
          alt=""
          style={{ height: "36px", filter: "brightness(0) invert(1)", opacity: 0.06, margin: "0 auto 12px", display: "block" }}
          onError={e => { e.target.style.display = "none"; }}
        />
        <p
          className="text-[8px] tracking-[0.4em] uppercase"
          style={{ color: `${C.ivory}18` }}
        >
          Discipline · Presence · Formation
        </p>
      </div>
    </section>
  );
}

const ARMOR_PIECE_TITLES = {
  "belt-of-truth": "Belt of Truth",
  "breastplate-of-righteousness": "Breastplate of Righteousness",
  "gospel-of-peace": "Gospel of Peace",
  "shield-of-faith": "Shield of Faith",
  "helmet-of-salvation": "Helmet of Salvation",
  "sword-of-the-spirit": "Sword of the Spirit",
};


const LANDING_SECTIONS = [
  { id: "hero",       label: "The Identity Pillar" },
  { id: "scripture",  label: "Ephesians 6" },
  { id: "revelation", label: "God's Own Armor" },
  { id: "six-pieces", label: "The Six Pieces" },
  { id: "why",        label: "The Closing" },
];

function SectionProgressNav() {
  const [activeSection, setActiveSection] = useState("hero");
  const [visible, setVisible] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    // Fade in after hero scrolled past
    const heroEl = document.getElementById("hero");
    if (!heroEl) return;
    const heroObs = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0.1 }
    );
    heroObs.observe(heroEl);

    // Track active section
    const ratios = {};
    const sectionObs = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => { ratios[e.target.id] = e.intersectionRatio; });
        let best = null, bestRatio = -1;
        LANDING_SECTIONS.forEach(({ id }) => {
          if ((ratios[id] ?? 0) > bestRatio) {
            bestRatio = ratios[id] ?? 0;
            best = id;
          }
        });
        if (best) setActiveSection(best);
      },
      { threshold: [0, 0.1, 0.25, 0.5, 0.75, 1.0] }
    );
    LANDING_SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) sectionObs.observe(el);
    });

    return () => { heroObs.disconnect(); sectionObs.disconnect(); };
  }, []);

  const activeIdx = LANDING_SECTIONS.findIndex(s => s.id === activeSection);

  return (
    <>
      {/* Desktop: vertical dot rail */}
      <div
        style={{
          position: "fixed",
          right: "20px",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 200,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.5s ease",
          pointerEvents: visible ? "auto" : "none",
        }}
        className="hidden md:flex"
      >
        {LANDING_SECTIONS.map(({ id, label }) => {
          const isActive = id === activeSection;
          return (
            <div
              key={id}
              style={{ position: "relative", display: "flex", alignItems: "center" }}
              onMouseEnter={() => setHoveredId(id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Tooltip */}
              <div style={{
                position: "absolute",
                right: "18px",
                whiteSpace: "nowrap",
                background: "rgba(6,5,10,0.9)",
                border: "1px solid rgba(201,168,76,0.2)",
                borderRadius: "999px",
                padding: "4px 12px",
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: "9px",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "#FAF8F5",
                opacity: hoveredId === id ? 1 : 0,
                transform: hoveredId === id ? "translateX(0)" : "translateX(4px)",
                transition: "opacity 0.2s ease, transform 0.2s ease",
                pointerEvents: "none",
              }}>
                {label}
              </div>
              {/* Dot */}
              <button
                onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}
                style={{
                  width: isActive ? "8px" : "6px",
                  height: isActive ? "8px" : "6px",
                  borderRadius: "50%",
                  background: isActive ? "#C9A84C" : "rgba(250,248,245,0.15)",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  transform: isActive ? "scale(1.3)" : "scale(1)",
                  boxShadow: isActive ? "0 0 8px rgba(201,168,76,0.5)" : "none",
                  transition: "all 0.3s ease",
                }}
                aria-label={`Scroll to ${label}`}
              />
            </div>
          );
        })}
      </div>

      {/* Mobile: segmented progress bar at bottom */}
      <div
        className="md:hidden"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 200,
          height: "3px",
          display: "flex",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.5s ease",
          pointerEvents: "none",
        }}
      >
        {LANDING_SECTIONS.map(({ id }, i) => (
          <div
            key={id}
            style={{
              flex: 1,
              background: i <= activeIdx ? "#C9A84C" : "rgba(255,255,255,0.08)",
              borderRight: i < LANDING_SECTIONS.length - 1 ? "1px solid rgba(6,5,10,0.5)" : "none",
              transition: "background 0.4s ease",
            }}
          />
        ))}
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
      <SectionProgressNav />
      <HeroSection />
      <ArmorIntroSection />
      <GodsArmorSection />
      <ArmorRingSection />
      <ClosingSection />
    </div>
  );
}

const PIECE_ORDER = [
  "belt-of-truth",
  "breastplate-of-righteousness",
  "gospel-of-peace",
  "shield-of-faith",
  "helmet-of-salvation",
  "sword-of-the-spirit",
];

const WIDGET_META = {
  "belt-of-truth":               { name: "Daily Examen",               desc: "Five guided examination questions with journaling fields. A nightly review of the day through the lens of consolation and desolation." },
  "breastplate-of-righteousness":{ name: "Declaration Builder",        desc: "Build a morning declaration card from your own identity statements. Formatted, printable, and shareable." },
  "gospel-of-peace":             { name: "Peace Pause Timer",          desc: "A three-checkpoint timer for morning, midday, and evening anchoring moments throughout the day." },
  "shield-of-faith":             { name: "Arrow Log",                  desc: "Name a lie you are believing. The tool returns a biblical truth and supporting scripture. Save entries to build a personal record over time." },
  "helmet-of-salvation":         { name: "First Fifteen Designer",     desc: "Design your morning first-fifteen-minute practice: Scripture, silence, prayer, declaration — in the order that forms you." },
  "sword-of-the-spirit":         { name: "Verse Memorization Tracker", desc: "Input your weekly verse, mark daily review completions, and build a growing library of memorized Scripture." },
};

/* ─── WIDGET MAP ─────────────────────────────────────────────────── */

const WIDGET_COMPONENTS = {
  "belt-of-truth":               ExamenWidget,
  "breastplate-of-righteousness": DeclarationWidget,
  "gospel-of-peace":             PeacePauseWidget,
  "shield-of-faith":             ArrowLogWidget,
  "helmet-of-salvation":         FirstFifteenWidget,
  "sword-of-the-spirit":         VerseTrackerWidget,
};

/* ─── CROSS-LINK DATA ────────────────────────────────────────────── */

const CROSS_LINKS = {
  "belt-of-truth":       { to: "/rule-of-life/presence",  rhythm: "PRESENCE",  tagline: "Attention before God" },
  "gospel-of-peace":     { to: "/rule-of-life/sabbath",   rhythm: "SABBATH",   tagline: "Rest before production" },
  "shield-of-faith":     { to: "/rule-of-life/community", rhythm: "COMMUNITY", tagline: "Formation together" },
  "helmet-of-salvation": { to: "/rule-of-life/scripture", rhythm: "SCRIPTURE", tagline: "Truth before noise" },
  "sword-of-the-spirit": { to: "/rule-of-life/scripture", rhythm: "SCRIPTURE", tagline: "Truth before noise" },
};

function CrossLinkCard({ piece }) {
  const link = CROSS_LINKS[piece];
  if (!link) return null;
  return (
    <Link
      to={link.to}
      style={{
        display: "block",
        textDecoration: "none",
        background: "rgba(201,168,76,0.04)",
        border: "1px solid rgba(201,168,76,0.14)",
        borderRadius: "14px",
        padding: "1.25rem 1.5rem",
        transition: "border-color .2s, background .2s",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = "rgba(201,168,76,0.08)";
        e.currentTarget.style.borderColor = "rgba(201,168,76,0.28)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = "rgba(201,168,76,0.04)";
        e.currentTarget.style.borderColor = "rgba(201,168,76,0.14)";
      }}
    >
      <p style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: "8px", letterSpacing: ".36em", textTransform: "uppercase", color: "rgba(201,168,76,0.55)", marginBottom: "6px" }}>
        Connected Rhythm
      </p>
      <p style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: "13px", letterSpacing: ".2em", textTransform: "uppercase", color: "#C9A84C", fontWeight: 700, marginBottom: "4px" }}>
        {link.rhythm}
      </p>
      <p style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic", fontSize: "14px", color: "rgba(250,248,245,0.45)", lineHeight: 1.4 }}>
        {link.tagline}
      </p>
    </Link>
  );
}

export function ArmorPiecePage() {
  const { piece }     = useParams();
  const navigate      = useNavigate();
  const [day, setDay] = useState(1);
  const [completedDays, setCompletedDays] = useState(() => {
    try {
      const stored = localStorage.getItem(`cf-armor-progress-${piece}`);
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });
  const [showQRWelcome, setShowQRWelcome] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('qr') === 'true';
  });
  const [qrFadingOut, setQRFadingOut] = useState(false);
  const progRef       = useRef(null);
  const wrapRef       = useRef(null);
  const heroBgRef     = useRef(null);
  const heroEyeRef    = useRef(null);
  const heroH1Ref     = useRef(null);
  const heroSubRef    = useRef(null);
  const sidebarRef    = useRef(null);
  const pieceNavRef   = useRef(null);

  const data = ARMOR_TRACKS[piece];

  useEffect(() => {
    if (!data) navigate("/identity", { replace: true });
  }, [data, navigate]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setDay(1);
    try {
      const stored = localStorage.getItem(`cf-armor-progress-${piece}`);
      setCompletedDays(stored ? JSON.parse(stored) : []);
    } catch { setCompletedDays([]); }
  }, [piece]);

  useEffect(() => {
    try {
      localStorage.setItem(`cf-armor-progress-${piece}`, JSON.stringify(completedDays));
    } catch {}
  }, [completedDays, piece]);

  useEffect(() => {
    if (!data) return;
    const onScroll = () => {
      const d = document.documentElement;
      const pct = d.scrollTop / (d.scrollHeight - d.clientHeight) || 0;
      if (progRef.current) progRef.current.style.width = (pct * 100) + "%";
      if (pct > 0.8 && !completedDays.includes(day)) {
        setCompletedDays(prev => [...new Set([...prev, day])]);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [data, day, completedDays]);

  /* ─── GSAP Piece Page Animations ─── */
  useEffect(() => {
    if (!data) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      /* === PAGE LOAD ANIMATIONS (immediate, not scroll-triggered) === */

      // Hero image: Ken Burns settle
      if (heroBgRef.current) {
        gsap.set(heroBgRef.current, { scale: 1.02 });
        gsap.fromTo(heroBgRef.current,
          { scale: 1.02 },
          { scale: 1.0, duration: 1.5, ease: "power2.out" }
        );
      }

      // Gold eyebrow label
      if (heroEyeRef.current) {
        gsap.set(heroEyeRef.current, { opacity: 0, y: 15 });
        gsap.fromTo(heroEyeRef.current,
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power2.out", delay: 0.1 }
        );
      }

      // Piece title
      if (heroH1Ref.current) {
        gsap.set(heroH1Ref.current, { opacity: 0, y: 20 });
        gsap.fromTo(heroH1Ref.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", delay: 0.3 }
        );
      }

      // Anchor scripture / track title subtitle
      if (heroSubRef.current) {
        gsap.set(heroSubRef.current, { opacity: 0, y: 15 });
        gsap.fromTo(heroSubRef.current,
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power2.out", delay: 0.6 }
        );
      }

      /* === SCROLL-TRIGGERED: Day section containers === */
      const daySections = [".ap-stillness", ".ap-scriptures", ".ap-teaching", ".ap-practice", ".ap-reflection"];
      daySections.forEach(sel => {
        const el = wrapRef.current?.querySelector(sel);
        if (el) {
          gsap.set(el, { opacity: 0, y: 25 });
          gsap.fromTo(el,
            { y: 25, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.9, ease: "power2.out",
              scrollTrigger: { trigger: el, start: "top 82%", toggleActions: "play none none reverse" } }
          );
        }
      });

      // Prayer section
      const prayerEl = wrapRef.current?.querySelector(".ap-prayer");
      if (prayerEl) {
        gsap.set(prayerEl, { opacity: 0, y: 15 });
        gsap.fromTo(prayerEl,
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power2.out",
            scrollTrigger: { trigger: prayerEl, start: "top 82%", toggleActions: "play none none reverse" } }
        );
      }

      /* === SCROLL-TRIGGERED: Section labels (gold eyebrow-style) === */
      const secLabels = wrapRef.current?.querySelectorAll(".ap-sec-label");
      if (secLabels) {
        secLabels.forEach(el => {
          gsap.set(el, { opacity: 0, y: 15 });
          gsap.fromTo(el,
            { y: 15, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7, ease: "power2.out",
              scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none reverse" } }
          );
        });
      }

      /* === SCROLL-TRIGGERED: Scripture blocks within day section === */
      const scriptureBlocks = wrapRef.current?.querySelectorAll(".ap-scripture");
      if (scriptureBlocks) {
        scriptureBlocks.forEach(el => {
          gsap.set(el, { opacity: 0, y: 15 });
          gsap.fromTo(el,
            { y: 15, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, delay: 0.2, ease: "power2.out",
              scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none reverse" } }
          );
        });
      }

      /* === SIDEBAR WIDGET: once: true fade-in === */
      if (sidebarRef.current) {
        gsap.set(sidebarRef.current, { opacity: 0, y: 20 });
        gsap.fromTo(sidebarRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.9, ease: "power2.out",
            scrollTrigger: { trigger: sidebarRef.current, start: "top 80%", once: true } }
        );
      }

      /* === PIECE NAVIGATION: bottom prev/next === */
      if (pieceNavRef.current) {
        const navBtns = pieceNavRef.current.querySelectorAll(".ap-nav-btn");
        if (navBtns.length) {
          gsap.set(navBtns, { opacity: 0, y: 15 });
          gsap.fromTo(navBtns,
            { y: 15, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power2.out",
              scrollTrigger: { trigger: pieceNavRef.current, start: "top 90%", toggleActions: "play none none reverse" } }
          );
        }
      }

    }, wrapRef);
    return () => ctx.revert();
  }, [data, piece, day]);

  if (!data) return null;

  const idx      = PIECE_ORDER.indexOf(piece);
  const prevSlug = PIECE_ORDER[idx - 1] ?? null;
  const nextSlug = PIECE_ORDER[idx + 1] ?? null;
  const prevData = prevSlug ? ARMOR_TRACKS[prevSlug] : null;
  const nextData = nextSlug ? ARMOR_TRACKS[nextSlug] : null;
  const curDay   = data.days[day - 1];
  const isLastDay = day === 6;

  return (
    <>
    {showQRWelcome && (
      <div
        className="fixed inset-0 z-[500] flex flex-col items-center justify-center text-center px-8"
        style={{
          backgroundColor: "#06050A",
          opacity: qrFadingOut ? 0 : 1,
          transition: "opacity 0.4s ease",
          pointerEvents: qrFadingOut ? "none" : "auto",
        }}
      >
        {data.icon && (
          <img src={data.icon} alt="" style={{ width: 40, mixBlendMode: "screen", opacity: 0.12, marginBottom: "2rem" }} />
        )}
        <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "10px", letterSpacing: "0.5em", textTransform: "uppercase", color: "#C9A84C", marginBottom: "1.5rem", fontWeight: 700 }}>
          You're Wearing the Armor
        </p>
        <h2 style={{ fontFamily: "'Michroma', sans-serif", fontSize: "clamp(28px, 6vw, 52px)", textTransform: "uppercase", letterSpacing: "0.1em", color: "#FAF8F5", lineHeight: 0.9, marginBottom: "1rem" }}>
          {data.title}
        </h2>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "clamp(15px, 3vw, 20px)", color: "rgba(250,248,245,0.4)", marginBottom: "3rem" }}>
          {data.trackTitle}
        </p>
        <button
          onClick={() => {
            setQRFadingOut(true);
            window.history.replaceState({}, '', window.location.pathname);
            setTimeout(() => setShowQRWelcome(false), 400);
          }}
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: "11px",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            fontWeight: 700,
            padding: "14px 36px",
            borderRadius: "999px",
            border: "none",
            background: "#C9A84C",
            color: "#0A0A0A",
            cursor: "pointer",
            boxShadow: "0 4px 32px rgba(201,168,76,0.3)",
          }}
        >
          Begin Formation →
        </button>
      </div>
    )}
    <div className="ap-wrap" ref={wrapRef}>
      <BackNav progRef={progRef} />

      {/* ── Hero ── */}
      <div className="ap-hero">
        <div className="ap-hero-bg" ref={heroBgRef} style={{ backgroundImage: `url('${data.img}')` }} />
        <div className="ap-hero-ov" />
        <div className="ap-hero-icon">
          {data.icon && (
            <img
              src={data.icon}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "contain", mixBlendMode: "screen" }}
            />
          )}
        </div>
        <div className="ap-hero-in">
          <p className="ap-hero-eye" ref={heroEyeRef}>Piece {data.num} · Armor of God</p>
          <h1 className="ap-hero-h1" ref={heroH1Ref}>{data.title}</h1>
          <p className="ap-hero-sub" ref={heroSubRef}>{data.trackTitle}</p>
        </div>
      </div>

      {/* ── Two-column content ── */}
      <div className="ap-content">

        {/* Day selector */}
        <div className="ap-day-nav">
          {data.icon && (
            <img
              src={data.icon}
              alt=""
              className="ap-day-nav-icon"
              style={{
                width: "28px",
                height: "28px",
                objectFit: "contain",
                                opacity: 0.35,
                flexShrink: 0,
                marginRight: "4px",
              }}
            />
          )}
          {data.days.map(d => (
            <button
              key={d.num}
              className={`ap-day-btn${day === d.num ? " active" : ""}${completedDays.includes(d.num) ? " completed" : ""}`}
              onClick={() => {
                setDay(d.num);
                const contentEl = document.querySelector('.ap-main');
                if (contentEl) {
                  const navHeight = document.querySelector('.ap-day-nav')?.offsetHeight || 60;
                  const top = contentEl.getBoundingClientRect().top + window.scrollY - navHeight - 16;
                  window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
                }
              }}
            >
              Day {d.num}
            </button>
          ))}
        </div>

        {/* Main column */}
        <div className="ap-main">
          <p className="ap-sec-label">Day {curDay.num} · {curDay.title}</p>

          {/* Stillness */}
          <p className="ap-stillness">{curDay.stillness}</p>

          {/* Scripture */}
          <div className="ap-scriptures">
            {curDay.scriptures.map((s, i) => (
              <div key={i} className="ap-scripture">
                <p>"{s.text}"</p>
                <cite><ScriptureRef reference={s.ref} text={s.text} /></cite>
              </div>
            ))}
          </div>

          <div className="ap-rule" />

          {/* Teaching */}
          <div className="ap-teaching">
            <p className="ap-sec-label">Teaching</p>
            {curDay.teaching.map((para, i) => (
              <p key={i} className="ap-body">{parseScriptureRefs(para)}</p>
            ))}
          </div>

          <div className="ap-rule" />

          {/* Practice */}
          <div className="ap-practice">
            <div className="ap-practice-head">
              <p className="ap-sec-label" style={{ margin: 0, border: "none", paddingBottom: 0 }}>Practice</p>
              <span className="ap-practice-badge">{curDay.practice.duration}</span>
            </div>
            <p className="ap-practice-body">{curDay.practice.body}</p>
          </div>

          {/* Reflection */}
          <div className="ap-reflection">
            <p className="ap-sec-label" style={{ marginBottom: ".75rem" }}>Reflection</p>
            {curDay.reflection}
          </div>

          {/* Prayer */}
          <div>
            <p className="ap-sec-label">Prayer</p>
            <div className="ap-prayer">{curDay.prayer}</div>
          </div>

          {/* Declare */}
          <FormationShareable
            trackName={data.title}
            dayNumber={curDay.num}
            scriptureRef={curDay.scriptures[0]?.ref ?? ""}
            isLastDay={isLastDay}
          />
        </div>

        {/* Sticky sidebar */}
        <div className="ap-sidebar" ref={sidebarRef}>
          <div>
            <p style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: "8px", letterSpacing: ".4em", textTransform: "uppercase", color: "rgba(201,168,76,0.5)", marginBottom: "1rem" }}>
              Formation Tool
            </p>
            {React.createElement(WIDGET_COMPONENTS[piece])}
          </div>

          <CrossLinkCard piece={piece} />

          <div>
            <p className="ap-armor-nav-label">The Six Pieces</p>
            <div className="ap-armor-nav">
              {PIECE_ORDER.map(slug => {
                const p = ARMOR_TRACKS[slug];
                return (
                  <Link
                    key={slug}
                    to={`/identity/${slug}`}
                    className={`ap-armor-link${slug === piece ? " active" : ""}`}
                  >
                    {p.icon && (
                      <img
                        src={p.icon}
                        alt=""
                        style={{
                          width: "20px",
                          height: "20px",
                          objectFit: "contain",
                                                    opacity: slug === piece ? 0.7 : 0.15,
                          flexShrink: 0,
                          transition: "opacity 0.2s",
                        }}
                      />
                    )}
                    <span className="ap-armor-link-num">{p.num}</span>
                    <span className="ap-armor-link-title">{p.title}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom navigation */}
        <div className="ap-piece-nav" ref={pieceNavRef}>
          {prevData ? (
            <Link to={`/identity/${prevSlug}`} className="ap-nav-btn">
              {prevData.icon && <img src={prevData.icon} alt="" style={{ width: "64px", height: "64px", objectFit: "contain", mixBlendMode: "screen", opacity: 0.7, flexShrink: 0 }} />}
              <span className="ap-nav-btn-text">
                <span className="ap-nav-btn-dir">← Piece {prevData.num}</span>
                <span className="ap-nav-btn-title">{prevData.title}</span>
              </span>
            </Link>
          ) : <div />}
          {nextData ? (
            <Link to={`/identity/${nextSlug}`} className="ap-nav-btn next">
              <span className="ap-nav-btn-text">
                <span className="ap-nav-btn-dir">Piece {nextData.num} →</span>
                <span className="ap-nav-btn-title">{nextData.title}</span>
              </span>
              {nextData.icon && <img src={nextData.icon} alt="" style={{ width: "64px", height: "64px", objectFit: "contain", mixBlendMode: "screen", opacity: 0.7, flexShrink: 0 }} />}
            </Link>
          ) : <div />}
        </div>

        {/* Mobile floating progress bar */}
        <div
          className="md:hidden"
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 80,
            background: "rgba(6,5,10,0.94)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            padding: "10px 20px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          {/* Progress dots */}
          <div style={{ display: "flex", gap: "4px", flexShrink: 0 }}>
            {data.days.map(d => (
              <div
                key={d.num}
                style={{
                  width: d.num === day ? 16 : 6,
                  height: 4,
                  borderRadius: 2,
                  background: completedDays.includes(d.num)
                    ? "#C9A84C"
                    : d.num === day
                      ? "rgba(201,168,76,0.5)"
                      : "rgba(255,255,255,0.1)",
                  transition: "all 0.3s",
                }}
              />
            ))}
          </div>

          {/* Day label */}
          <span style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: "10px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(250,248,245,0.4)",
            flex: 1,
            minWidth: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}>
            Day {day} · {curDay.title}
          </span>

          {/* Next day / complete action */}
          {day < 6 ? (
            <button
              onClick={() => {
                setDay(day + 1);
                const contentEl = document.querySelector('.ap-main');
                if (contentEl) {
                  const navHeight = document.querySelector('.ap-day-nav')?.offsetHeight || 60;
                  const top = contentEl.getBoundingClientRect().top + window.scrollY - navHeight - 16;
                  window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
                }
              }}
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: "9px",
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                fontWeight: 700,
                padding: "8px 16px",
                borderRadius: "999px",
                border: "none",
                background: "#C9A84C",
                color: "#0A0A0A",
                cursor: "pointer",
                flexShrink: 0,
                whiteSpace: "nowrap",
              }}
            >
              Day {day + 1} →
            </button>
          ) : (
            <Link
              to={nextSlug ? `/identity/${nextSlug}` : "/identity"}
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: "9px",
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                fontWeight: 700,
                padding: "8px 16px",
                borderRadius: "999px",
                border: "1px solid rgba(201,168,76,0.4)",
                background: "transparent",
                color: "#C9A84C",
                textDecoration: "none",
                flexShrink: 0,
                whiteSpace: "nowrap",
              }}
            >
              {nextSlug ? "Next Piece →" : "← Identity"}
            </Link>
          )}
        </div>

      </div>

    </div>
    </>
  );
}
