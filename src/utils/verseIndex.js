// Static verse text lookup for ScriptureRef popovers.
// Keys use hyphens (not en-dashes) and "Psalm" not "Psalms".
// Access via lookupVerse(reference) which normalizes before lookup.
// Translation: ESV unless otherwise noted.

const VERSES = {

  /* ── OLD TESTAMENT ─────────────────────────────────────────── */

  "Genesis 2:1-3":
    "Thus the heavens and the earth were finished, and all the host of them. And on the seventh day God finished his work that he had done, and he rested on the seventh day from all his work that he had done. So God blessed the seventh day and made it holy, because on it God rested from all his work that he had done in creation.",

  "Exodus 20:8":
    "Remember the Sabbath day, to keep it holy.",

  "Exodus 20:8-10":
    "Remember the Sabbath day, to keep it holy. Six days you shall labor, and do all your work, but the seventh day is a Sabbath to the Lord your God.",

  "Deuteronomy 5:15":
    "You shall remember that you were a slave in the land of Egypt, and the Lord your God brought you out from there with a mighty hand and an outstretched arm. Therefore the Lord your God commanded you to keep the Sabbath day.",

  "Deuteronomy 6:6-7":
    "And these words that I command you today shall be on your heart. You shall teach them diligently to your children, and shall talk of them when you sit in your house, and when you walk by the way, and when you lie down, and when you rise.",

  "1 Kings 19:4":
    "But he himself went a day's journey into the wilderness and came and sat down under a broom tree. And he asked that he might die, saying, 'It is enough; now, O Lord, take away my life.'",

  "Psalm 1:1-2":
    "Blessed is the man who walks not in the counsel of the wicked, nor stands in the way of sinners, nor sits in the seat of scoffers; but his delight is in the law of the Lord, and on his law he meditates day and night.",

  "Psalm 5:3":
    "O Lord, in the morning you hear my voice; in the morning I prepare a sacrifice for you and watch.",

  "Psalm 10:1":
    "Why, O Lord, do you stand far away? Why do you hide yourself in times of trouble?",

  "Psalm 22:1":
    "My God, my God, why have you forsaken me? Why are you so far from saving me, from the words of my groaning?",

  "Psalm 34:18":
    "The Lord is near to the brokenhearted and saves the crushed in spirit.",

  "Psalm 40:1":
    "I waited patiently for the Lord; he inclined to me and heard my cry.",

  "Psalm 42:5":
    "Why are you cast down, O my soul, and why are you in turmoil within me? Hope in God; for I shall again praise him, my salvation and my God.",

  "Psalm 46:10":
    "Be still, and know that I am God. I will be exalted among the nations, I will be exalted in the earth!",

  "Psalm 51:6":
    "Behold, you delight in truth in the inward being, and you teach me wisdom in the secret heart.",

  "Psalm 62:8":
    "Trust in him at all times, O people; pour out your heart before him; God is a refuge for us.",

  "Psalm 101:3":
    "I will not set before my eyes anything that is worthless. I hate the work of those who fall away; it shall not cling to me.",

  "Psalm 119:9":
    "How can a young man keep his way pure? By guarding it according to your word.",

  "Psalm 119:9-11":
    "How can a young man keep his way pure? By guarding it according to your word... I have stored up your word in my heart, that I might not sin against you.",

  "Psalm 119:11":
    "I have stored up your word in my heart, that I might not sin against you.",

  "Psalm 119:105":
    "Your word is a lamp to my feet and a light to my path.",

  "Psalm 138:1":
    "I give you thanks, O Lord, with my whole heart; before the gods I sing your praise.",

  "Psalm 139:1-2":
    "O Lord, you have searched me and known me! You know when I sit down and when I rise up; you perceive my thoughts from afar.",

  "Psalm 139:7":
    "Where shall I go from your Spirit? Or where shall I flee from your presence?",

  "Psalm 139:23-24":
    "Search me, O God, and know my heart! Try me and know my thoughts! And see if there be any grievous way in me, and lead me in the way everlasting!",

  "Psalm 143:8":
    "Let me hear in the morning of your steadfast love, for in you I trust. Make me know the way I should go, for to you I lift up my soul.",

  "Psalm 145:18":
    "The Lord is near to all who call on him, to all who call on him in truth.",

  "Proverbs 4:23":
    "Keep your heart with all vigilance, for from it flow the springs of life.",

  "Proverbs 15:1":
    "A soft answer turns away wrath, but a harsh word stirs up anger.",

  "Proverbs 18:21":
    "Death and life are in the power of the tongue, and those who love it will eat its fruits.",

  "Proverbs 23:23":
    "Buy truth, and do not sell it; buy wisdom, instruction, and understanding.",

  "Proverbs 27:6":
    "Faithful are the wounds of a friend; profuse are the kisses of an enemy.",

  "Proverbs 27:17":
    "Iron sharpens iron, and one man sharpens another.",

  "Ecclesiastes 4:9-10":
    "Two are better than one, because they have a good reward for their toil. For if they fall, one will lift up his fellow. But woe to him who is alone when he falls and has not another to lift him up!",

  "Ecclesiastes 4:12":
    "And though a man might prevail against one who is alone, two will withstand him — a threefold cord is not quickly broken.",

  "Isaiah 26:3":
    "You keep him in perfect peace whose mind is stayed on you, because he trusts in you.",

  "Isaiah 30:15":
    "For thus said the Lord God, the Holy One of Israel, 'In returning and rest you shall be saved; in quietness and in trust shall be your strength.'",

  "Isaiah 40:8":
    "The grass withers, the flower fades, but the word of our God will stand forever.",

  "Isaiah 61:7":
    "Instead of your shame there shall be a double portion; instead of dishonor they shall rejoice in their lot; therefore in their land they shall possess a double portion; they shall have everlasting joy.",

  "Isaiah 61:10":
    "I will greatly rejoice in the Lord; my soul shall exult in my God, for he has clothed me with the garments of salvation; he has covered me with the robe of righteousness.",

  "Jeremiah 17:9":
    "The heart is deceitful above all things, and desperately sick; who can understand it?",

  "Lamentations 3:40":
    "Let us test and examine our ways, and return to the Lord!",

  "Hosea 4:6":
    "My people are destroyed for lack of knowledge.",

  /* ── NEW TESTAMENT ─────────────────────────────────────────── */

  "Matthew 4:1":
    "Then Jesus was led up by the Spirit into the wilderness to be tempted by the devil.",

  "Matthew 4:4":
    "But he answered, 'It is written, Man shall not live by bread alone, but by every word that comes from the mouth of God.'",

  "Matthew 4:7":
    "Jesus said to him, 'Again it is written, You shall not put the Lord your God to the test.'",

  "Matthew 4:10":
    "Then Jesus said to him, 'Be gone, Satan! For it is written, You shall worship the Lord your God and him only shall you serve.'",

  "Matthew 5:9":
    "Blessed are the peacemakers, for they shall be called sons of God.",

  "Matthew 6:9-13":
    "Our Father in heaven, hallowed be your name. Your kingdom come, your will be done, on earth as it is in heaven. Give us this day our daily bread, and forgive us our debts, as we also have forgiven our debtors. And lead us not into temptation, but deliver us from evil.",

  "Matthew 6:27":
    "And which of you by being anxious can add a single hour to his span of life?",

  "Matthew 11:28":
    "Come to me, all who labor and are heavy laden, and I will give you rest.",

  "Matthew 11:28-29":
    "Come to me, all who labor and are heavy laden, and I will give you rest. Take my yoke upon you, and learn from me, for I am gentle and lowly in heart, and you will find rest for your souls.",

  "Matthew 26:36":
    "Then Jesus went with them to a place called Gethsemane, and he said to his disciples, 'Sit here, while I go over there and pray.'",

  "Mark 1:35":
    "And rising very early in the morning, while it was still dark, he departed and went out to a desolate place, and there he prayed.",

  "Mark 2:3-5":
    "And they came, bringing to him a paralytic carried by four men. And when they could not get near him because of the crowd, they removed the roof above him, and when they had made an opening, they let down the bed on which the paralytic lay. And when Jesus saw their faith, he said to the paralytic, 'Son, your sins are forgiven.'",

  "Mark 2:27":
    "And he said to them, 'The Sabbath was made for man, not man for the Sabbath.'",

  "Luke 6:12":
    "In these days he went out to the mountain to pray, and all night he continued in prayer to God.",

  "John 1:14":
    "And the Word became flesh and dwelt among us, and we have seen his glory, glory as of the only Son from the Father, full of grace and truth.",

  "John 5:39":
    "You search the Scriptures because you think that in them you have eternal life; and it is they that bear witness about me.",

  "John 8:32":
    "and you will know the truth, and the truth will set you free.",

  "John 10:10":
    "The thief comes only to steal and kill and destroy. I came that they may have life and have it abundantly.",

  "John 14:6":
    "Jesus said to him, 'I am the way, and the truth, and the life. No one comes to the Father except through me.'",

  "John 14:27":
    "Peace I leave with you; my peace I give to you. Not as the world gives do I give to you. Let not your hearts be troubled, neither let them be afraid.",

  "John 16:33":
    "I have said these things to you, that in me you may have peace. In the world you will have tribulation. But take heart; I have overcome the world.",

  "Acts 2:42":
    "And they devoted themselves to the apostles' teaching and the fellowship, to the breaking of bread and the prayers.",

  "Romans 8:1":
    "There is therefore now no condemnation for those who are in Christ Jesus.",

  "Romans 8:26":
    "Likewise the Spirit helps us in our weakness. For we do not know what to pray for as we ought, but the Spirit himself intercedes for us with groanings too deep for words.",

  "Romans 8:28":
    "And we know that for those who love God all things work together for good, for those who are called according to his purpose.",

  "Romans 8:38-39":
    "For I am sure that neither death nor life, nor angels nor rulers, nor things present nor things to come, nor powers, nor height nor depth, nor anything else in all creation, will be able to separate us from the love of God in Christ Jesus our Lord.",

  "Romans 12:2":
    "Do not be conformed to this world, but be transformed by the renewal of your mind, that by testing you may discern what is the will of God, what is good and acceptable and perfect.",

  "Romans 12:3":
    "For by the grace given to me I say to everyone among you not to think of himself more highly than he ought to think, but to think with sober judgment, each according to the measure of faith that God has assigned.",

  "Romans 12:18":
    "If possible, so far as it depends on you, live peaceably with all.",

  "1 Corinthians 4:7":
    "For who sees anything different in you? What do you have that you did not receive? If then you received it, why do you boast as if you did not receive it?",

  "2 Corinthians 5:17":
    "Therefore, if anyone is in Christ, he is a new creation. The old has passed away; behold, the new has come.",

  "2 Corinthians 5:21":
    "For our sake he made him to be sin who knew no sin, so that in him we might become the righteousness of God.",

  "2 Corinthians 10:5":
    "We destroy arguments and every lofty opinion raised against the knowledge of God, and take every thought captive to obey Christ.",

  "2 Corinthians 13:5":
    "Examine yourselves, to see whether you are in the faith. Test yourselves.",

  "Galatians 2:20":
    "I have been crucified with Christ. It is no longer I who live, but Christ who lives in me. And the life I now live in the flesh I live by faith in the Son of God, who loved me and gave himself for me.",

  "Galatians 3:3":
    "Are you so foolish? Having begun by the Spirit, are you now being perfected by the flesh?",

  "Galatians 6:2":
    "Bear one another's burdens, and so fulfill the law of Christ.",

  "Ephesians 2:8-9":
    "For by grace you have been saved through faith. And this is not your own doing; it is the gift of God, not a result of works, so that no one may boast.",

  "Ephesians 2:10":
    "For we are his workmanship, created in Christ Jesus for good works, which God prepared beforehand, that we should walk in them.",

  "Ephesians 4:25":
    "Therefore, having put away falsehood, let each one of you speak the truth with his neighbor, for we are members one of another.",

  "Ephesians 5:15-16":
    "Look carefully then how you walk, not as unwise but as wise, making the best use of the time, because the days are evil.",

  "Ephesians 6:15":
    "and, as shoes for your feet, having put on the readiness given by the gospel of peace.",

  "Ephesians 6:16":
    "In all circumstances take up the shield of faith, with which you can extinguish all the flaming darts of the evil one.",

  "Philippians 1:6":
    "And I am sure of this, that he who began a good work in you will bring it to completion at the day of Jesus Christ.",

  "Philippians 3:9":
    "and be found in him, not having a righteousness of my own that comes from the law, but that which comes through faith in Christ, the righteousness from God that depends on faith.",

  "Philippians 4:5-6":
    "The Lord is at hand; do not be anxious about anything.",

  "Philippians 4:6":
    "do not be anxious about anything, but in everything by prayer and supplication with thanksgiving let your requests be made known to God.",

  "Philippians 4:6-7":
    "do not be anxious about anything, but in everything by prayer and supplication with thanksgiving let your requests be made known to God. And the peace of God, which surpasses all understanding, will guard your hearts and your minds in Christ Jesus.",

  "Colossians 1:13":
    "He has delivered us from the domain of darkness and transferred us to the kingdom of his beloved Son.",

  "Colossians 3:2":
    "Set your minds on things that are above, not on things that are on earth.",

  "Colossians 3:16":
    "Let the word of Christ dwell in you richly, teaching and admonishing one another in all wisdom, singing psalms and hymns and spiritual songs, with thankfulness in your hearts to God.",

  "1 Thessalonians 5:11":
    "Therefore encourage one another and build one another up, just as you are doing.",

  "1 Thessalonians 5:17":
    "Pray without ceasing.",

  "2 Timothy 1:7":
    "for God gave us a spirit not of fear but of power and love and self-control.",

  "2 Timothy 2:15":
    "Do your best to present yourself to God as one approved, a worker who has no need to be ashamed, rightly handling the word of truth.",

  "2 Timothy 3:16":
    "All Scripture is breathed out by God and profitable for teaching, for reproof, for correction, and for training in righteousness.",

  "1 Timothy 2:8":
    "I desire then that in every place the men should pray, lifting holy hands without anger or quarreling.",

  "Hebrews 4:9-10":
    "So then, there remains a Sabbath rest for the people of God, for whoever has entered God's rest has also rested from his works as God did from his.",

  "Hebrews 4:12":
    "For the word of God is living and active, sharper than any two-edged sword, piercing to the division of soul and of spirit, of joints and of marrow, and discerning the thoughts and intentions of the heart.",

  "Hebrews 10:24-25":
    "And let us consider how to stir up one another to love and good works, not neglecting to meet together, as is the habit of some, but encouraging one another, and all the more as you see the Day drawing near.",

  "Hebrews 10:25":
    "not neglecting to meet together, as is the habit of some, but encouraging one another, and all the more as you see the Day drawing near.",

  "Hebrews 11:1":
    "Now faith is the assurance of things hoped for, the conviction of things not seen.",

  "Hebrews 11:6":
    "And without faith it is impossible to please him, for whoever would draw near to God must believe that he exists and that he rewards those who seek him.",

  "Hebrews 13:15":
    "Through him then let us continually offer up a sacrifice of praise to God, that is, the fruit of lips that acknowledge his name.",

  "James 4:6":
    "But he gives more grace. Therefore it says, 'God opposes the proud but gives grace to the humble.'",

  "James 5:16":
    "Therefore, confess your sins to one another and pray for one another, that you may be healed. The prayer of a righteous person has great power as it is working.",

  "1 Peter 5:7":
    "casting all your anxieties on him, because he cares for you.",

  "1 Peter 5:8":
    "Be sober-minded; be watchful. Your adversary the devil prowls around like a roaring lion, seeking someone to devour.",

  "1 John 1:8":
    "If we say we have no sin, we deceive ourselves, and the truth is not in us.",

  "1 John 3:1":
    "See what kind of love the Father has given to us, that we should be called children of God; and so we are.",

  "Matthew 7:7":
    "Ask, and it will be given to you; seek, and you will find; knock, and it will be opened to you.",

  "Mark 9:24":
    "Immediately the father of the child cried out and said, 'I believe; help my unbelief!'",

};

/**
 * Look up verse text by reference string.
 * Normalizes en-dashes to hyphens and "Psalms" to "Psalm" before lookup.
 * Returns empty string if not found (popover will still show ref + Bible.com link).
 */
export function lookupVerse(reference) {
  if (!reference) return "";
  const key = reference
    .replace(/\u2013|\u2014/g, "-")   // en-dash / em-dash → hyphen
    .replace(/^Psalms\b/, "Psalm");    // Psalms → Psalm
  return VERSES[key] || "";
}
