// src/fruitAssessmentData.js

export const SCALE_OPTIONS = [
  { value: 1, label: "Rarely" },
  { value: 2, label: "Occasionally" },
  { value: 3, label: "Sometimes" },
  { value: 4, label: "Often" },
  { value: 5, label: "Usually" },
  { value: 6, label: "Almost Always" },
];

export const CLUSTER_THRESHOLD = 8;

export const FRUIT_ORDER = [
  "love","joy","peace","patience","kindness",
  "goodness","faithfulness","gentleness","self_control",
];

// 27 questions in exact interleaved assessment order.
// The fruit name is NOT shown to the user during the assessment.
// reverse: true means effective score = 7 - answer
export const QUESTIONS = [
  { id: "love_1",         fruitKey: "love",         reverse: false, text: "When someone disappoints or wrongs me, my first instinct is to consider what they might be carrying rather than focus on how I have been affected." },
  { id: "joy_1",          fruitKey: "joy",          reverse: false, text: "My sense of contentment remains relatively stable across good and difficult seasons, rather than rising and falling with circumstances." },
  { id: "peace_1",        fruitKey: "peace",        reverse: false, text: "When outcomes are outside my control, I am able to release them without extended anxiety or mental rehearsal." },
  { id: "patience_1",     fruitKey: "patience",     reverse: false, text: "When people or processes move more slowly than I would like, I respond with steadiness rather than frustration." },
  { id: "kindness_1",     fruitKey: "kindness",     reverse: false, text: "I am attentive to the needs of people around me, even when I am preoccupied with my own concerns." },
  { id: "goodness_1",     fruitKey: "goodness",     reverse: false, text: "My private behavior and my public behavior are consistent. I live with similar integrity when no one is watching." },
  { id: "faithfulness_1", fruitKey: "faithfulness", reverse: false, text: "I follow through on commitments even when my motivation has faded or circumstances have changed." },
  { id: "gentleness_1",   fruitKey: "gentleness",   reverse: false, text: "I am able to correct, confront, or disagree with someone without leaving them feeling diminished or attacked." },
  { id: "self_control_1", fruitKey: "self_control", reverse: false, text: "When an appetite -- food, attention, entertainment, anger, lust -- pulls at me, I am generally able to pause before acting." },
  { id: "love_2",         fruitKey: "love",         reverse: true,  text: "I find myself keeping a mental ledger of how people have treated me and adjusting what I give them accordingly." },
  { id: "joy_2",          fruitKey: "joy",          reverse: true,  text: "When life feels flat or hard, I struggle to access any genuine sense of gladness." },
  { id: "peace_2",        fruitKey: "peace",        reverse: true,  text: "My mind tends to loop on worst-case scenarios, especially at night or in quiet moments." },
  { id: "patience_2",     fruitKey: "patience",     reverse: true,  text: "I find myself mentally rehearsing a frustrated response before I have even reacted outwardly." },
  { id: "kindness_2",     fruitKey: "kindness",     reverse: true,  text: "I tend to move past people I encounter in daily life without really noticing them." },
  { id: "goodness_2",     fruitKey: "goodness",     reverse: true,  text: "There are meaningful gaps between what I profess publicly and how I actually behave in private." },
  { id: "faithfulness_2", fruitKey: "faithfulness", reverse: true,  text: "I tend to start commitments strong and let them quietly fade when they become inconvenient." },
  { id: "gentleness_2",   fruitKey: "gentleness",   reverse: true,  text: "When I am frustrated, my strength tends to come out as sharpness or force rather than restraint." },
  { id: "self_control_2", fruitKey: "self_control", reverse: true,  text: "My actions are more often driven by what I feel in the moment than by what I have decided is true." },
  { id: "love_3",         fruitKey: "love",         reverse: false, text: "When a relationship requires sacrifice with no clear personal benefit, I tend to lean in rather than pull back." },
  { id: "joy_3",          fruitKey: "joy",          reverse: false, text: "I find genuine delight in ordinary moments, not just in milestones or achievements." },
  { id: "peace_3",        fruitKey: "peace",        reverse: false, text: "I bring a calming presence to tense or uncertain situations rather than adding to the friction." },
  { id: "patience_3",     fruitKey: "patience",     reverse: false, text: "When I am wronged or treated unfairly, I am able to wait and trust rather than retaliate or force resolution." },
  { id: "kindness_3",     fruitKey: "kindness",     reverse: false, text: "I find myself looking for practical ways to make things easier for the people in my life." },
  { id: "goodness_3",     fruitKey: "goodness",     reverse: false, text: "When I see an opportunity to do what is right, I act on it even when it is inconvenient or costly." },
  { id: "faithfulness_3", fruitKey: "faithfulness", reverse: false, text: "I sustain spiritual rhythms and disciplines through dry seasons, not only when they feel rewarding." },
  { id: "gentleness_3",   fruitKey: "gentleness",   reverse: false, text: "My strength and conviction tend to express themselves with restraint and care rather than force." },
  { id: "self_control_3", fruitKey: "self_control", reverse: false, text: "I have established rhythms and boundaries in my life that hold even when I do not feel like maintaining them." },
];

export const FRUITS = {
  love: {
    key: "love",
    label: "Love",
    greek: "Agape",
    formationStatement: "Love in the biblical sense is not a feeling. It is a decision made repeatedly in the direction of another person's good, often at personal cost. The places where love is difficult for you are the most honest map of where self-protection is still operating. The Spirit's invitation here is not to feel more warmly toward difficult people. It is to act rightly toward them before the feeling follows.",
    scripture: {
      text: "And walk in love, as Christ loved us and gave himself up for us.",
      reference: "Ephesians 5:2",
    },
    practice: "This week, identify one person it costs you something to love well, and make one concrete, unrequired gesture toward their good.",
    ruleOfLife: { rhythm: "Community", path: "/rule-of-life/community" },
  },
  joy: {
    key: "joy",
    label: "Joy",
    greek: "Chara",
    formationStatement: "The joy the Spirit produces is not an emotion dependent on circumstances. It is a settled conviction that God is good and sovereign, which holds even when nothing around you confirms it. If your joy rises and falls with what is happening to you, you are drawing from the wrong well. The Spirit's work here is not to make you feel better. It is to root you in something that cannot be taken.",
    scripture: {
      text: "Rejoice in the Lord always; again I will say, rejoice.",
      reference: "Philippians 4:4",
    },
    practice: "Each morning this week, before engaging any input or device, complete this sentence in writing: \"God is good because --\" and let that anchor the first hour.",
    ruleOfLife: { rhythm: "Presence", path: "/rule-of-life/presence" },
  },
  peace: {
    key: "peace",
    label: "Peace",
    greek: "Eirene",
    formationStatement: "The peace God offers is not the absence of difficulty. It is an interior settledness that coexists with difficulty. Anxiety is almost always a form of attempted sovereignty: the mind rehearsing outcomes it cannot control in hopes of managing them in advance. The Spirit's invitation here is not to stop thinking carefully. It is to release what was never yours to carry.",
    scripture: {
      text: "And the peace of God, which surpasses all understanding, will guard your hearts and your minds in Christ Jesus.",
      reference: "Philippians 4:7",
    },
    practice: "This week, when you notice anxiety rising about a specific outcome, name it aloud, and practice a 60-second release: \"This is not mine to control. I give it back.\"",
    ruleOfLife: { rhythm: "Prayer", path: "/rule-of-life/prayer" },
  },
  patience: {
    key: "patience",
    label: "Patience",
    greek: "Makrothumia",
    formationStatement: "Patience is not passive endurance. It is active trust. The places in your life where frustration surfaces most quickly are not character flaws to manage; they are invitations to a deeper surrender. The Spirit's work here is not to make you slow. It is to make you unshakeable.",
    scripture: {
      text: "Be completely humble and gentle; be patient, bearing with one another in love.",
      reference: "Ephesians 4:2",
    },
    practice: "Identify one recurring situation that consistently triggers impatience this week, and build a deliberate pause into your response pattern: 60 seconds before reacting, every time.",
    ruleOfLife: { rhythm: "Sabbath", path: "/rule-of-life/sabbath" },
  },
  kindness: {
    key: "kindness",
    label: "Kindness",
    greek: "Chrestotes",
    formationStatement: "Kindness as the Spirit produces it is not a temperament. It is an attentiveness to the people in front of you that refuses to be crowded out by your own preoccupations. The world forms us toward efficiency and self-focus; kindness is a structural act of resistance against both. The invitation here is not to be nicer. It is to actually see the people you are moving past.",
    scripture: {
      text: "Be kind to one another, tenderhearted, forgiving one another, as God in Christ forgave you.",
      reference: "Ephesians 4:32",
    },
    practice: "This week, choose one person in your daily orbit who often goes unnoticed by you, and make one deliberate, unhurried gesture of consideration toward them each day.",
    ruleOfLife: { rhythm: "Community", path: "/rule-of-life/community" },
  },
  goodness: {
    key: "goodness",
    label: "Goodness",
    greek: "Agathosune",
    formationStatement: "Goodness in the biblical sense is not rule-following. It is moral integrity expressed in action, consistent whether or not anyone is watching. The gap between who you are in public and who you are in private is the most accurate measure of where this fruit is still forming. The Spirit's work here is not to improve your performance. It is to close the gap between the two.",
    scripture: {
      text: "For we are his workmanship, created in Christ Jesus for good works, which God prepared beforehand, that we should walk in them.",
      reference: "Ephesians 2:10",
    },
    practice: "This week, identify one area where your private behavior is inconsistent with what you profess, and make one structural decision that brings them into alignment.",
    ruleOfLife: { rhythm: "Scripture", path: "/rule-of-life/scripture" },
  },
  faithfulness: {
    key: "faithfulness",
    label: "Faithfulness",
    greek: "Pistis",
    formationStatement: "Faithfulness is what love looks like over time. It is not a burst of commitment followed by drift. It is the quiet, unglamorous decision to follow through when motivation is gone, when no one is watching, and when the return is not immediately visible. This is where most formation actually happens: not in the inspired moments but in the ordinary ones that never get noticed.",
    scripture: {
      text: "His master said to him, 'Well done, good and faithful servant.'",
      reference: "Matthew 25:21",
    },
    practice: "Identify one commitment -- to a person, a practice, or a discipline -- that you have been inconsistent in, and recommit to it with one concrete structural change that removes the decision from your willpower.",
    ruleOfLife: { rhythm: "Sabbath", path: "/rule-of-life/sabbath" },
  },
  gentleness: {
    key: "gentleness",
    label: "Gentleness",
    greek: "Prautes",
    formationStatement: "Gentleness is not weakness. It is strength that has learned restraint. The Greek word carried the image of a wild horse brought under the control of its rider: all the power remains; what changes is who is directing it. The question this fruit raises is not whether you are strong. It is whether your strength is submitted to something larger than yourself.",
    scripture: {
      text: "But the meek shall inherit the earth and delight themselves in abundant peace.",
      reference: "Psalm 37:11",
    },
    practice: "This week, in one conversation where you hold power or advantage, practice using that position deliberately for the benefit of the other person -- not for efficiency or resolution, but for their good.",
    ruleOfLife: { rhythm: "Community", path: "/rule-of-life/community" },
  },
  self_control: {
    key: "self_control",
    label: "Self-Control",
    greek: "Egkrateia",
    formationStatement: "Self-control as the Spirit produces it is not white-knuckle willpower. It is a life so ordered around what is true and good that the appetites lose their command over you. The rhythms you build or fail to build are not incidental; they are the architecture of whether you are governed by your desires or by your convictions. Formation here is not about suppression. It is about building a life where you are not ruled.",
    scripture: {
      text: "But I discipline my body and keep it under control, lest after preaching to others I myself should be disqualified.",
      reference: "1 Corinthians 9:27",
    },
    practice: "Identify one specific appetite -- food, attention, entertainment, anger, lust -- that is currently governing your behavior more than your convictions are, and build one concrete boundary around it this week.",
    ruleOfLife: { rhythm: "Presence", path: "/rule-of-life/presence" },
  },
};
