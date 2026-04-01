# Identity Pillar Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build six individual armor-piece devotional pages at `/identity/[piece]`, each with a hero band, six-day devotional content navigated by day tabs, and a sticky sidebar widget placeholder — all following the Rule of Life two-column desktop layout.

**Architecture:** A single `ArmorPiecePage` component in `src/Identity.jsx` handles all six pieces via a dynamic route param. A companion `ArmorStyles` CSS component (same pattern as `RuleStyles` in RuleOfLife.jsx) is rendered at the app root. All 36 days of content live as a `ARMOR_TRACKS` JS data object in Identity.jsx.

**Tech Stack:** React 18, React Router v6, GSAP (scroll progress bar only), Vite, inline CSS-in-JS style block, Tailwind (existing classes on some elements)

---

## File Map

| File | Change |
|---|---|
| `src/Identity.jsx` | Add `ARMOR_TRACKS` data + `ArmorStyles` component + `ArmorPiecePage` component |
| `src/App.jsx` | Add `ArmorStyles` to root render; swap six static routes for one dynamic route |

No new files created.

---

## Task 1: Add ARMOR_TRACKS — Belt of Truth (all 6 days)

**Files:**
- Modify: `src/Identity.jsx` — add `ARMOR_TRACKS` const after the existing `DROP_PRODUCTS` const (around line 107)

- [ ] **Step 1: Add the data object**

Insert directly after the `DROP_PRODUCTS` array in `src/Identity.jsx`:

```js
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
```

- [ ] **Step 2: Verify data is syntactically valid**

Run: `npm run build`  
Expected: Build completes with no errors (data object may be unused at this point — that's fine).

- [ ] **Step 3: Commit**

```bash
git add src/Identity.jsx
git commit -m "feat(identity): add ARMOR_TRACKS data — Belt of Truth (all 6 days)"
```

---

## Task 2: Add ARMOR_TRACKS — Tracks 2–6

**Files:**
- Modify: `src/Identity.jsx` — replace `// Tracks 2-6 added in Task 2` comment with data for the five remaining tracks

**Source:** Read `Content/ArmorOfGod_AllTracks.md` — sections are headed:
- `# TRACK 02: BREASTPLATE OF RIGHTEOUSNESS — "Already Clothed"` (days 1–6)
- `# TRACK 03: GOSPEL OF PEACE — "Ground Beneath You"` (days 1–6)
- `# TRACK 04: SHIELD OF FAITH — "Behind What God Has Said"` (days 1–6)
- `# TRACK 05: HELMET OF SALVATION — "A Protected Mind"` (days 1–6)
- `# TRACK 06: SWORD OF THE SPIRIT — "The Word as Weapon"` (days 1–6)

Each track's each day has these sections in the markdown: `### Stillness`, `### Scripture`, `### Teaching`, `### Practice: N Minutes`, `### Reflection`, `### Prayer`, `### Declare`. Map them to the same shape used for Belt of Truth in Task 1.

- [ ] **Step 1: Add the five track entries**

Replace `// Tracks 2-6 added in Task 2` with entries following the exact shape below. Read each section from the content file and transcribe — the structure for all five is identical to Belt of Truth:

```js
  "breastplate-of-righteousness": {
    num: "02",
    title: "Breastplate of Righteousness",
    trackTitle: "Already Clothed",
    img: "/Breastplate_wide.png",
    cumulative: "Morning declaration (3–5 identity sentences)",
    days: [
      // 6 days — each with: num, title, stillness, scriptures[], teaching[], practice{duration,body}, reflection, prayer
      // Read from Content/ArmorOfGod_AllTracks.md ## TRACK 02 sections
    ],
  },

  "gospel-of-peace": {
    num: "03",
    title: "Gospel of Peace",
    trackTitle: "Ground Beneath You",
    img: "/GosPeace_wide.png",
    cumulative: "Peace Pause rhythm (3 daily anchoring statements)",
    days: [ /* 6 days from ## TRACK 03 */ ],
  },

  "shield-of-faith": {
    num: "04",
    title: "Shield of Faith",
    trackTitle: "Behind What God Has Said",
    img: "/Shield_wide.png",
    cumulative: "Arrow log (lies vs. truth document)",
    days: [ /* 6 days from ## TRACK 04 */ ],
  },

  "helmet-of-salvation": {
    num: "05",
    title: "Helmet of Salvation",
    trackTitle: "A Protected Mind",
    img: "/Helmet_wide.png",
    cumulative: "First Fifteen morning practice design",
    days: [ /* 6 days from ## TRACK 05 */ ],
  },

  "sword-of-the-spirit": {
    num: "06",
    title: "Sword of the Spirit",
    trackTitle: "The Word as Weapon",
    img: "/Sword_wide.png",
    cumulative: "Verse memorization system + first 5 verses",
    days: [ /* 6 days from ## TRACK 06 */ ],
  },
```

**Note on Day 6 Declare prompt:** Day 6's declare prompt differs from Days 1–5. Days 1–5 use "What is the one thing God showed you today?" Day 6 uses "What is the one thing God showed you this week?" Store this as a boolean flag `isFinal: true` on the day 6 object for each track, and handle the prompt in the renderer.

- [ ] **Step 2: Verify build passes**

Run: `npm run build`  
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/Identity.jsx
git commit -m "feat(identity): add ARMOR_TRACKS data — tracks 2–6 (Breastplate through Sword)"
```

---

## Task 3: Add ArmorStyles CSS component

**Files:**
- Modify: `src/Identity.jsx` — add `ArmorStyles` function just before `BackNav` (around line 109 after DROP_PRODUCTS/ARMOR_TRACKS)
- Modify: `src/App.jsx` — import `ArmorStyles` and render it at root

- [ ] **Step 1: Add ArmorStyles to Identity.jsx**

Insert after `ARMOR_TRACKS` and before `function BackNav()`:

```js
export function ArmorStyles() {
  return (
    <style>{`
      .ap-wrap * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
      .ap-wrap   { font-family: 'Barlow Condensed', sans-serif; background: #06050A; color: #FAF8F5; min-height: 100svh; overflow-x: hidden; }

      /* Progress bar */
      .ap-prog-bar  { position: sticky; top: 0; z-index: 190; height: 2px; background: rgba(255,255,255,0.05); }
      .ap-prog-fill { height: 100%; width: 0; background: linear-gradient(to right, #C9A84C, rgba(201,168,76,0.35)); transition: width .12s linear; }

      /* Hero */
      .ap-hero { position: relative; overflow: hidden; min-height: clamp(480px, 65vw, 780px); display: flex; flex-direction: column; justify-content: flex-end; }
      .ap-hero-bg  { position: absolute; inset: 0; background-size: cover; background-position: center center; filter: grayscale(.2); }
      .ap-hero-ov  { position: absolute; inset: 0; background: linear-gradient(to top, rgba(6,5,10,0.97) 0%, rgba(6,5,10,0.45) 50%, rgba(6,5,10,0.1) 100%); }
      .ap-hero-num { position: absolute; right: -0.02em; bottom: -0.1em; font-family: 'Michroma', sans-serif; font-size: clamp(120px, 18vw, 220px); color: #FAF8F5; opacity: 0.07; line-height: 1; pointer-events: none; z-index: 1; }
      .ap-hero-in  { position: relative; z-index: 2; padding: 2rem 24px 2.5rem; max-width: 860px; margin: 0 auto; width: 100%; }
      .ap-hero-eye { font-size: 10px; letter-spacing: .5em; text-transform: uppercase; color: #C9A84C; margin-bottom: .75rem; font-weight: 700; }
      .ap-hero-h1  { font-family: 'Michroma', sans-serif; font-size: clamp(36px, 8vw, 88px); text-transform: uppercase; letter-spacing: 0.1em; color: #FAF8F5; line-height: .9; margin-bottom: 1rem; }
      .ap-hero-sub { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: clamp(15px, 3vw, 20px); color: rgba(250,248,245,0.4); }

      /* Content grid */
      .ap-content { max-width: 800px; margin: 0 auto; padding: 44px 20px 100px; }

      /* Day selector */
      .ap-day-nav { display: flex; overflow-x: auto; gap: 4px; padding-bottom: 1px; margin-bottom: 2.5rem; border-bottom: 1px solid rgba(255,255,255,0.07); scrollbar-width: none; }
      .ap-day-nav::-webkit-scrollbar { display: none; }
      .ap-day-btn { flex-shrink: 0; padding: 10px 18px; border: none; background: transparent; border-bottom: 2px solid transparent; cursor: pointer; font-family: 'Barlow Condensed', sans-serif; font-size: 9px; letter-spacing: .32em; text-transform: uppercase; color: rgba(250,248,245,0.28); transition: color .2s, border-color .2s; }
      .ap-day-btn.active { color: #C9A84C; border-bottom-color: #C9A84C; }
      .ap-day-btn:hover:not(.active) { color: rgba(250,248,245,0.55); }

      /* Section labels */
      .ap-sec-label { font-size: 9px; letter-spacing: .45em; text-transform: uppercase; color: #C9A84C; margin-bottom: 1.25rem; padding-bottom: .75rem; border-bottom: 1px solid rgba(255,255,255,0.06); }

      /* Stillness */
      .ap-stillness { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: clamp(16px, 3.5vw, 20px); color: rgba(250,248,245,0.5); line-height: 1.8; margin-bottom: 2.5rem; padding-left: 1.25rem; border-left: 2px solid rgba(201,168,76,0.2); }

      /* Scripture */
      .ap-scriptures { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 2.5rem; }
      .ap-scripture  { background: rgba(255,255,255,0.025); border-left: 2px solid #C9A84C; border-radius: 0 12px 12px 0; padding: 1.25rem 1.5rem; }
      .ap-scripture p    { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: clamp(15px, 3.5vw, 18px); color: rgba(250,248,245,0.72); line-height: 1.7; margin-bottom: .5rem; }
      .ap-scripture cite { font-size: 9px; letter-spacing: .32em; text-transform: uppercase; color: #C9A84C; font-style: normal; }

      /* Teaching */
      .ap-teaching { margin-bottom: 2.5rem; }
      .ap-body { font-family: 'Cormorant Garamond', serif; font-size: clamp(16px, 3.8vw, 20px); line-height: 1.88; color: rgba(250,248,245,0.74); margin-bottom: 1.25rem; }

      /* Practice */
      .ap-practice { background: rgba(201,168,76,0.04); border: 1px solid rgba(201,168,76,0.15); border-radius: 18px; padding: 1.75rem; margin-bottom: 2.5rem; }
      .ap-practice-head { display: flex; align-items: center; gap: 12px; margin-bottom: 1.25rem; }
      .ap-practice-badge { font-size: 8px; letter-spacing: .28em; text-transform: uppercase; color: rgba(201,168,76,0.65); border: 1px solid rgba(201,168,76,0.25); border-radius: 999px; padding: 4px 12px; }
      .ap-practice-body { font-family: 'Cormorant Garamond', serif; font-size: clamp(15px, 3.5vw, 18px); line-height: 1.82; color: rgba(250,248,245,0.65); white-space: pre-line; }

      /* Reflection */
      .ap-reflection { background: rgba(201,168,76,0.04); border: 1px solid rgba(201,168,76,0.12); border-radius: 14px; padding: 1.5rem; margin-bottom: 2.5rem; font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: clamp(15px, 3.5vw, 18px); color: rgba(250,248,245,0.6); line-height: 1.7; }

      /* Prayer */
      .ap-prayer { background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.07); border-radius: 18px; padding: 2rem; margin-bottom: 2.5rem; font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: clamp(15px, 3.5vw, 18px); color: rgba(250,248,245,0.62); line-height: 1.9; white-space: pre-line; }

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
      .ap-nav-btn { flex: 1; padding: 16px 20px; border-radius: 999px; border: 1px solid rgba(255,255,255,0.10); background: rgba(255,255,255,0.03); text-decoration: none; display: flex; flex-direction: column; gap: 4px; transition: border-color .25s, background .25s; }
      .ap-nav-btn:hover { border-color: rgba(201,168,76,0.4); background: rgba(201,168,76,0.05); }
      .ap-nav-btn-dir   { font-size: 8px; letter-spacing: .36em; text-transform: uppercase; color: rgba(201,168,76,0.6); }
      .ap-nav-btn-title { font-family: 'Michroma', sans-serif; font-size: clamp(12px, 1.8vw, 15px); text-transform: uppercase; letter-spacing: .08em; color: #FAF8F5; line-height: 1.1; }
      .ap-nav-btn.next  { text-align: right; align-items: flex-end; }

      /* Footer */
      .ap-footer { background: #06050A; border-top: 1px solid rgba(255,255,255,0.05); padding: 28px 1.5rem; text-align: center; }
      .ap-footer img { width: 24px; height: 24px; opacity: .2; filter: invert(1); display: block; margin: 0 auto .75rem; }
      .ap-footer p   { font-size: 8px; letter-spacing: .28em; text-transform: uppercase; color: rgba(255,255,255,0.18); }

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
```

- [ ] **Step 2: Add ArmorStyles to App.jsx**

In `src/App.jsx`, update the import line around line 25:

```js
import { IdentityLanding, ArmorPiecePlaceholder, ArmorStyles } from "./Identity";
```

In the BrowserRouter render (around line 1538), add `<ArmorStyles />` alongside the other style components:

```jsx
<FieldGuideStyles />
<ChallengeStyles />
<RuleStyles />
<ArchitectureStyles />
<ArmorStyles />
```

- [ ] **Step 3: Verify build**

Run: `npm run build`  
Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add src/Identity.jsx src/App.jsx
git commit -m "feat(identity): add ArmorStyles CSS component"
```

---

## Task 4: Build ArmorPiecePage — hero band + skeleton

**Files:**
- Modify: `src/Identity.jsx` — replace `ArmorPiecePlaceholder` function with `ArmorPiecePage`

The widget descriptions per piece (for the sidebar placeholder):

| Slug | Widget Name | Widget Description |
|---|---|---|
| belt-of-truth | Daily Examen | Five guided examination questions with journaling fields. A nightly review of the day through the lens of consolation and desolation. |
| breastplate-of-righteousness | Declaration Builder | Build a morning declaration card from your own identity statements. Formatted, printable, and shareable. |
| gospel-of-peace | Peace Pause Timer | A three-checkpoint timer for morning, midday, and evening anchoring moments throughout the day. |
| shield-of-faith | Arrow Log | A two-column journal: lies you're hearing on the left, what God has said on the right. Patterns emerge over time. |
| helmet-of-salvation | First Fifteen Designer | Design your morning first-fifteen-minute practice: Scripture, silence, prayer, declaration — in the order that forms you. |
| sword-of-the-spirit | Verse Memorization Tracker | Input your weekly verse, mark daily review completions, and build a growing library of memorized Scripture. |

- [ ] **Step 1: Replace ArmorPiecePlaceholder with ArmorPiecePage**

Remove the existing `ArmorPiecePlaceholder` function entirely and replace with:

```jsx
const PIECE_ORDER = [
  "belt-of-truth",
  "breastplate-of-righteousness",
  "gospel-of-peace",
  "shield-of-faith",
  "helmet-of-salvation",
  "sword-of-the-spirit",
];

const WIDGET_META = {
  "belt-of-truth":               { name: "Daily Examen",              desc: "Five guided examination questions with journaling fields. A nightly review of the day through the lens of consolation and desolation." },
  "breastplate-of-righteousness":{ name: "Declaration Builder",       desc: "Build a morning declaration card from your own identity statements. Formatted, printable, and shareable." },
  "gospel-of-peace":             { name: "Peace Pause Timer",         desc: "A three-checkpoint timer for morning, midday, and evening anchoring moments throughout the day." },
  "shield-of-faith":             { name: "Arrow Log",                 desc: "A two-column journal: lies you're hearing on the left, what God has said on the right. Patterns emerge over time." },
  "helmet-of-salvation":         { name: "First Fifteen Designer",    desc: "Design your morning first-fifteen-minute practice: Scripture, silence, prayer, declaration — in the order that forms you." },
  "sword-of-the-spirit":         { name: "Verse Memorization Tracker",desc: "Input your weekly verse, mark daily review completions, and build a growing library of memorized Scripture." },
};

export function ArmorPiecePage() {
  const { piece }    = useParams();
  const navigate     = useNavigate();
  const [day, setDay] = React.useState(1);
  const progRef      = React.useRef(null);

  const data = ARMOR_TRACKS[piece];

  useEffect(() => {
    if (!data) navigate("/identity", { replace: true });
  }, [data, navigate]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setDay(1);
  }, [piece]);

  useEffect(() => {
    if (!data) return;
    const onScroll = () => {
      const d = document.documentElement;
      const pct = d.scrollTop / (d.scrollHeight - d.clientHeight) || 0;
      if (progRef.current) progRef.current.style.width = (pct * 100) + "%";
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [data]);

  if (!data) return null;

  const idx      = PIECE_ORDER.indexOf(piece);
  const prevSlug = PIECE_ORDER[idx - 1] ? PIECE_ORDER[idx - 1] : null;
  const nextSlug = PIECE_ORDER[idx + 1] ? PIECE_ORDER[idx + 1] : null;
  const prevData = prevSlug ? ARMOR_TRACKS[prevSlug] : null;
  const nextData = nextSlug ? ARMOR_TRACKS[nextSlug] : null;
  const curDay   = data.days[day - 1];
  const widget   = WIDGET_META[piece];
  const isLastDay = day === 6;

  return (
    <div className="ap-wrap">
      <BackNav />
      <div className="ap-prog-bar"><div className="ap-prog-fill" ref={progRef} /></div>

      {/* ── Hero ── */}
      <div className="ap-hero">
        <div className="ap-hero-bg" style={{ backgroundImage: `url('${data.img}')` }} />
        <div className="ap-hero-ov" />
        <div className="ap-hero-num">{data.num}</div>
        <div className="ap-hero-in">
          <p className="ap-hero-eye">Piece {data.num} · Armor of God</p>
          <h1 className="ap-hero-h1">{data.title}</h1>
          <p className="ap-hero-sub">{data.trackTitle}</p>
        </div>
      </div>

      {/* ── Two-column content ── */}
      <div className="ap-content">

        {/* Day selector */}
        <div className="ap-day-nav">
          {data.days.map(d => (
            <button
              key={d.num}
              className={`ap-day-btn${day === d.num ? " active" : ""}`}
              onClick={() => { setDay(d.num); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            >
              Day {d.num}
            </button>
          ))}
        </div>

        {/* Main column */}
        <div className="ap-main">
          {/* Day title */}
          <p className="ap-sec-label">Day {curDay.num} · {curDay.title}</p>

          {/* Stillness */}
          <p className="ap-stillness">{curDay.stillness}</p>

          {/* Scripture */}
          <div className="ap-scriptures">
            {curDay.scriptures.map((s, i) => (
              <div key={i} className="ap-scripture">
                <p>"{s.text}"</p>
                <cite>{s.ref}</cite>
              </div>
            ))}
          </div>

          <div className="ap-rule" />

          {/* Teaching */}
          <div className="ap-teaching">
            <p className="ap-sec-label">Teaching</p>
            {curDay.teaching.map((para, i) => (
              <p key={i} className="ap-body">{para}</p>
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
          <div className="ap-declare">
            <p className="ap-declare-label">Declare</p>
            <p className="ap-declare-prompt">
              {isLastDay
                ? "What is the one thing God showed you this week?"
                : "What is the one thing God showed you today?"}
            </p>
          </div>
        </div>

        {/* Sticky sidebar */}
        <div className="ap-sidebar">
          {/* Widget placeholder */}
          <div className="ap-widget-placeholder">
            <p className="ap-widget-label">Interactive Widget</p>
            <p className="ap-widget-title">{widget.name}</p>
            <p className="ap-widget-desc">{widget.desc}</p>
            <p className="ap-widget-soon">Coming in next session</p>
          </div>

          {/* Armor piece navigation */}
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
                    <span className="ap-armor-link-num">{p.num}</span>
                    <span className="ap-armor-link-title">{p.title}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom navigation */}
        <div className="ap-piece-nav">
          {prevData ? (
            <Link to={`/identity/${prevSlug}`} className="ap-nav-btn">
              <span className="ap-nav-btn-dir">← Piece {prevData.num}</span>
              <span className="ap-nav-btn-title">{prevData.title}</span>
            </Link>
          ) : <div />}
          {nextData ? (
            <Link to={`/identity/${nextSlug}`} className="ap-nav-btn next">
              <span className="ap-nav-btn-dir">Piece {nextData.num} →</span>
              <span className="ap-nav-btn-title">{nextData.title}</span>
            </Link>
          ) : <div />}
        </div>

      </div>

      <footer className="ap-footer">
        <img src="/helmet.png" onError={e => { e.target.style.display = "none"; }} alt="" />
        <p>Counter Formation · Armor of God · Ephesians 6:10–18 · © 2026</p>
      </footer>
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`  
Expected: No errors. (The `useParams` import must already be in Identity.jsx — check the top import; if `useParams` and `useNavigate` are missing, add them to the existing import from `react-router-dom`.)

- [ ] **Step 3: Commit**

```bash
git add src/Identity.jsx
git commit -m "feat(identity): add ArmorPiecePage component — hero, day tabs, content renderer, sidebar, nav"
```

---

## Task 5: Update App.jsx routes

**Files:**
- Modify: `src/App.jsx` — update import and routes

- [ ] **Step 1: Update the Identity import**

Find line ~25:
```js
import { IdentityLanding, ArmorPiecePlaceholder } from "./Identity";
```

Replace with:
```js
import { IdentityLanding, ArmorPiecePage, ArmorStyles } from "./Identity";
```

- [ ] **Step 2: Replace the six static routes with one dynamic route**

Find these six lines (around line 1562):
```jsx
<Route path="/identity/belt-of-truth"               element={<ArmorPiecePlaceholder />} />
<Route path="/identity/breastplate-of-righteousness" element={<ArmorPiecePlaceholder />} />
<Route path="/identity/gospel-of-peace"             element={<ArmorPiecePlaceholder />} />
<Route path="/identity/shield-of-faith"             element={<ArmorPiecePlaceholder />} />
<Route path="/identity/helmet-of-salvation"         element={<ArmorPiecePlaceholder />} />
<Route path="/identity/sword-of-the-spirit"         element={<ArmorPiecePlaceholder />} />
```

Replace all six with one dynamic route:
```jsx
<Route path="/identity/:piece" element={<ArmorPiecePage />} />
```

- [ ] **Step 3: Verify build**

Run: `npm run build`  
Expected: No errors, no references to `ArmorPiecePlaceholder` remain.

- [ ] **Step 4: Commit**

```bash
git add src/App.jsx
git commit -m "feat(identity): wire ArmorPiecePage to dynamic /identity/:piece route"
```

---

## Task 6: Manual smoke test

**Run dev server:** `npm run dev`  
Open browser to `http://localhost:5173`

- [ ] **Check: /identity landing still works** — navigate to `/identity`, confirm the armor piece grid renders and links to `/identity/belt-of-truth` etc.

- [ ] **Check: Belt of Truth loads** — navigate to `/identity/belt-of-truth`
  - Hero image shows (or graceful fallback if `/Belt_wide.png` not yet uploaded)
  - Gold eyebrow reads `PIECE 01 · ARMOR OF GOD`
  - Title `BELT OF TRUTH` in Michroma font
  - Subtitle `Living in the Light` in italic
  - Background numeral `01` visible at low opacity in hero
  - Day selector shows Day 1 through Day 6
  - Day 1 content renders: Stillness text, 3 scripture cards, Teaching paragraphs, Practice box with duration badge, Reflection, Prayer, Declare prompt

- [ ] **Check: Day switching** — click Day 2 through Day 6, confirm content updates. Day 6 Declare prompt reads "this week" not "today".

- [ ] **Check: Desktop two-column** — at ≥1024px viewport, sidebar is sticky on the right, main content on left.

- [ ] **Check: Mobile** — at <1024px, sidebar renders below content, day tabs scroll horizontally.

- [ ] **Check: Sidebar** — widget placeholder shows widget name and description for Belt of Truth. Armor piece navigation links all 6 pieces. Active piece highlighted in gold.

- [ ] **Check: Bottom navigation** — Belt of Truth shows no previous button. Breastplate of Righteousness button appears on the right.

- [ ] **Check: All 6 pieces** — navigate to each `/identity/[slug]`. Confirm each loads, title is correct, and the navigation links work correctly (Belt ← has no prev, Sword → has no next).

- [ ] **Check: Progress bar** — scroll down, gold bar at top fills proportionally.

- [ ] **Check: Back nav** — `← Identity` button in top-left returns to `/identity`.

- [ ] **Commit final:**

```bash
git add .
git commit -m "feat(identity): complete Identity Pillar pages — six armor-piece devotional pages"
```

---

## Self-Review

**Spec coverage:**
- ✅ Hero image + gold eyebrow with piece number and name — Task 4, hero band
- ✅ Six-day devotional content from markdown — Tasks 1 & 2 (data) + Task 4 (renderer)
- ✅ Rule of Life two-column desktop layout — Task 3 CSS grid + Task 4 layout
- ✅ Sticky sidebar — Task 3 CSS + Task 4 sidebar section
- ✅ Widget placeholder — Task 4 sidebar, `WIDGET_META` per piece
- ✅ Bottom navigation linking previous/next piece — Task 4 `ap-piece-nav`
- ✅ Six individual pages at `/identity/[piece]` — Task 5 dynamic route
- ✅ `ArmorStyles` at app root matching RuleStyles pattern — Task 3

**Not in scope (confirmed per spec):** ScriptureRef popovers, FormationShareable/ArmorCard, Declare input, Further reading grid, Cross-links to Rule of Life.

**Type consistency check:**
- `ARMOR_TRACKS[piece]` → `data.days[day - 1]` → `curDay.stillness`, `curDay.scriptures[]`, `curDay.teaching[]`, `curDay.practice.duration`, `curDay.practice.body`, `curDay.reflection`, `curDay.prayer` — all consistent across data shape (Task 1) and renderer (Task 4).
- `PIECE_ORDER` array used for prev/next calculation and sidebar nav — consistent.
- `WIDGET_META[piece]` → `widget.name`, `widget.desc` — consistent.
