import React, { useState, useEffect, useMemo } from 'react';
import { BookOpen, CheckCircle, XCircle, RefreshCw, Trophy, Home, Layers, MapPin, Clock, ChevronRight, ChevronLeft, Globe, Zap, Brain } from 'lucide-react';

// --- CUSTOM SWISS FLAG COMPONENT ---
const SwissFlag = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="4" fill="#DC2626" />
    <path d="M13 6H19V13H26V19H19V26H13V19H6V13H13V6Z" fill="white" />
  </svg>
);

// --- IMPORTED QUESTIONS DATA ---
const QUESTIONS_DATA = [
  {
    id: 1,
    category: "Demokratie und Föderalismus",
    level: "Bund",
    question: "Die Schweiz ist neutral. Was heisst das?",
    questionEn: "Switzerland is neutral. What does that mean?",
    options: ["Sie unterzeichnet keine internationalen Verträge.", "Sie schliesst nur mit Staaten Verträge, die nicht in Kriege verwickelt sind.", "Sie mischt sich nicht in bewaffnete Konflikte anderer Staaten ein.", "Sie will als Transitland wirtschaftlich unabhängig sein."],
    optionsEn: ["It does not sign any international treaties.", "It only concludes treaties with states that are not involved in wars.", "It does not interfere in armed conflicts of other states.", "It wants to be economically independent as a transit country."],
    correct: 2
  },
  {
    id: 2,
    category: "Demokratie und Föderalismus",
    level: "Bund",
    question: "Was ist eine Grenzgängerin oder ein Grenzgänger?",
    questionEn: "What is a cross-border commuter ('Grenzgänger')?",
    options: ["eine Person, die in der Schweiz arbeitet und im Ausland wohnt", "eine Person, die nicht im gleichen Kanton wohnt und arbeitet", "Schweizer Handelsware, die ins Ausland exportiert wird", "Schweizer Handelsware, die vom Ausland in die Schweiz importiert wird"],
    optionsEn: ["a person who works in Switzerland and lives abroad", "a person who does not live and work in the same canton", "Swiss merchandise exported abroad", "Swiss merchandise imported into Switzerland from abroad"],
    correct: 0
  },
  {
    id: 3,
    category: "Demokratie und Föderalismus",
    level: "Bund",
    question: "Confoederatio Helvetica...",
    questionEn: "Confoederatio Helvetica...",
    options: ["ist der Name einer Schweizer Schokolade.", "ist der lateinische Name für die Schweizer Eidgenossenschaft.", "ist der Name des ersten Parlaments der Schweiz.", "ist eine Fraktion des Parlaments."],
    optionsEn: ["is the name of a Swiss chocolate.", "is the Latin name for the Swiss Confederation.", "is the name of the first parliament of Switzerland.", "is a faction of the parliament."],
    correct: 1
  },
  {
    id: 5,
    category: "Demokratie und Föderalismus",
    level: "Bund",
    question: "Zwischen den Mitgliedern des Bundesrats gilt das Kollegialitätsprinzip. Was heisst das?",
    questionEn: "The principle of collegiality applies among the members of the Federal Council. What does that mean?",
    options: ["Die Mitglieder des Bundesrates müssen sich gut kennen.", "Jeder Bundesrat vertritt seine eigenen politischen Meinungen.", "Alle Mitglieder müssen Entscheide des Bundesrates nach aussen gleich vertreten.", "Der Bundesrat Entscheidungen mit Abstimmung."],
    optionsEn: ["The members of the Federal Council must know each other well.", "Every Federal Councillor represents their own political opinions.", "All members must outwardly represent the decisions of the Federal Council equally.", "The Federal Council makes decisions by vote."],
    correct: 2
  },
  {
    id: 6,
    category: "Demokratie und Föderalismus",
    level: "Bund",
    question: "Können die Stimmbürgerinnen und Stimmbürger ein neues Gesetz stoppen?",
    questionEn: "Can the eligible voters stop a new law?",
    options: ["Ja mit einer Initiative", "Nein nur der Bundesrat kann Gesetze ändern", "Nein nur der Nationalrat kann Gesetze ändern", "Ja mit einem Referendum"],
    optionsEn: ["Yes, with an initiative", "No, only the Federal Council can change laws", "No, only the National Council can change laws", "Yes, with a referendum"],
    correct: 3
  },
  {
    id: 8,
    category: "Demokratie und Föderalismus",
    level: "Bund",
    question: "Was bedeutet bei Abstimmungen «Ständemehr»?",
    questionEn: "What does 'Ständemehr' (majority of the cantons) mean in votes?",
    options: ["Mehrheit aller Stimmen", "Mehrheit der Kantone", "Mehrheit der Stimmen nach Sprachregionen der Schweiz", "Mehrheit in den vorausgegangenen Meinungsumfragen"],
    optionsEn: ["majority of all votes", "majority of the cantons", "majority of the votes according to the language regions of Switzerland", "majority in the previous opinion polls"],
    correct: 1
  },
  {
    id: 10,
    category: "Demokratie und Föderalismus",
    level: "Bund",
    question: "Wer in der Schweiz wählen und abstimmen will,",
    questionEn: "Anyone who wants to vote and elect in Switzerland,",
    options: ["muss das Schweizer Bürgerrecht haben.", "muss einen Computer haben.", "muss in der Schweiz geboren sein.", "muss mehr Steuern zahlen."],
    optionsEn: ["must have Swiss citizenship.", "must have a computer.", "must have been born in Switzerland.", "must pay more taxes."],
    correct: 0
  },
  {
    id: 20,
    category: "Demokratie und Föderalismus",
    level: "Bund",
    question: "Wie heissen die beiden «Kammern» des Schweizer Parlaments?",
    questionEn: "What are the names of the two 'chambers' of the Swiss Parliament?",
    options: ["Oberhaus und Unterhaus", "Senat und Kongress", "Nationalrat und Ständerat", "Fraktion und Kommission"],
    optionsEn: ["Upper House and Lower House", "Senate and Congress", "National Council and Council of States", "Faction and Commission"],
    correct: 2
  },
  {
    id: 25,
    category: "Demokratie und Föderalismus",
    level: "Bund",
    question: "Wer führt die Regierungsgeschäfte der Schweiz?",
    questionEn: "Who conducts the government business of Switzerland?",
    options: ["die Parteien", "die Medien", "der Bundesrat", "die Bundesversammlung"],
    optionsEn: ["the political parties", "the media", "the Federal Council", "the Federal Assembly"],
    correct: 2
  },
  {
    id: 33,
    category: "Demokratie und Föderalismus",
    level: "Bund",
    question: "Weshalb ist die Volksinitiative ein wichtiges politisches Recht der Stimmbürgerinnen und Stimmbürger?",
    questionEn: "Why is the popular initiative an important political right for eligible voters?",
    options: ["das Parlament ausschalten.", "die Regierung abwählen.", "politische Entscheidungen rückgängig machen.", "wichtige Anliegen aus der Bevölkerung politisch durchsetzen."],
    optionsEn: ["eliminate the parliament.", "vote out the government.", "reverse political decisions.", "politically enforce important concerns from the population."],
    correct: 3
  },
  {
    id: 41,
    category: "Demokratie und Föderalismus",
    level: "Bund",
    question: "Wer wählt die sieben Mitglieder des Bundesrats?",
    questionEn: "Who elects the seven members of the Federal Council?",
    options: ["die Parteipräsidentinnen und Parteipräsidenten", "die Stimmbürgerinnen und Stimmbürger in direkter Wahl", "der Rat der Ältesten", "Nationalrat und Ständerat"],
    optionsEn: ["the party presidents", "the eligible voters in a direct election", "the Council of Elders", "the National Council and the Council of States"],
    correct: 3
  },
  {
    id: 57,
    category: "Demokratie und Föderalismus",
    level: "Bund",
    question: "Wie viele Kantone hat der Schweizer Bundesstaat?",
    questionEn: "How many cantons does the Swiss federal state have?",
    options: ["12 (10 Kantone und 2 Halbkantone)", "26 (20 Kantone und 6 Halbkantone)", "34 (28 Kantone und 6 Halbkantone)", "16 (12 Kantone und 4 Halbkantone)"],
    optionsEn: ["12 (10 cantons and 2 half-cantons)", "26 (20 cantons and 6 half-cantons)", "34 (28 cantons and 6 half-cantons)", "16 (12 cantons and 4 half-cantons)"],
    correct: 1
  },
  {
    id: 59,
    category: "Demokratie und Föderalismus",
    level: "Bund",
    question: "Die Schweiz ist ein föderalistischer Staat mit drei Staatsebenen. Was ist die unterste Ebene?",
    questionEn: "Switzerland is a federalist state with three state levels. What is the lowest level?",
    options: ["der Kanton", "die Gemeinde", "der Bezirk", "der Bund"],
    optionsEn: ["the canton", "the municipality", "the district", "the confederation (federal level)"],
    correct: 1
  },
  {
    id: 63,
    category: "Demokratie und Föderalismus",
    level: "Bund",
    question: "Was sind die Landessprachen der Schweiz?",
    questionEn: "What are the national languages of Switzerland?",
    options: ["Französisch, Italienisch, Englisch, Deutsch", "Französisch, Italienisch, Rätoromanisch, Deutsch", "Französisch, Italienisch, Dialekte der Kantone und Rätoromanisch", "Deutsch, Französisch, Italienisch"],
    optionsEn: ["French, Italian, English, German", "French, Italian, Romansh, German", "French, Italian, Cantonal dialects and Romansh", "German, French, Italian"],
    correct: 1
  },
  {
    id: 100,
    category: "Demokratie und Föderalismus",
    level: "Kanton",
    question: "Wie viele Regierungsräte hat der Kanton Zürich?",
    questionEn: "How many members does the Government Council (Regierungsrat) of the Canton of Zurich have?",
    options: ["3", "250", "7", "180"],
    optionsEn: ["3", "250", "7", "180"],
    correct: 2
  },
  {
    id: 102,
    category: "Demokratie und Föderalismus",
    level: "Kanton",
    question: "Wie heisst in der Stadt Zürich die Exekutive?",
    questionEn: "What is the name of the executive branch in the city of Zurich?",
    options: ["Stadtrat", "Nationalrat", "Regierungsrat", "Bundesrat"],
    optionsEn: ["City Council (Stadtrat)", "National Council (Nationalrat)", "Government Council (Regierungsrat)", "Federal Council (Bundesrat)"],
    correct: 0
  },
  {
    id: 104,
    category: "Demokratie und Föderalismus",
    level: "Kanton",
    question: "Wie viele Bezirke gibt es im Kanton Zürich?",
    questionEn: "How many districts are there in the Canton of Zurich?",
    options: ["12", "18", "7", "25"],
    optionsEn: ["12", "18", "7", "25"],
    correct: 0
  },
  {
    id: 108,
    category: "Demokratie und Föderalismus",
    level: "Kanton",
    question: "Wie oft werden die Mitglieder des Kantonsrats gewählt?",
    questionEn: "How often are the members of the Cantonal Council elected?",
    options: ["alle 6 Jahre", "alle 2 Jahre", "alle 7 Jahre", "alle 4 Jahre"],
    optionsEn: ["every 6 years", "every 2 years", "every 7 years", "every 4 years"],
    correct: 3
  },
  {
    id: 112,
    category: "Demokratie und Föderalismus",
    level: "Kanton",
    question: "Wie heisst das Parlament im Kanton Zürich?",
    questionEn: "What is the name of the parliament in the Canton of Zurich?",
    options: ["Landtag", "Grosser Rat", "Kantonsrat", "Regierungsrat"],
    optionsEn: ["Cantonal Assembly (Landtag)", "Grand Council (Grosser Rat)", "Cantonal Council (Kantonsrat)", "Government Council (Regierungsrat)"],
    correct: 2
  },
  {
    id: 113,
    category: "Demokratie und Föderalismus",
    level: "Kanton",
    question: "Wie werden die Mitglieder der Zürcher Regierung bestimmt?",
    questionEn: "How are the members of the Zurich government determined?",
    options: ["Sie werden von den Parteien ernannt.", "Sie werden vom Kantonsrat gewählt.", "Sie werden auf Parteiversammlungen gewählt.", "Sie werden von den Zürcher Stimmbürgerinnen und Stimmbürgern gewählt."],
    optionsEn: ["They are appointed by the political parties.", "They are elected by the Cantonal Council.", "They are elected at party assemblies.", "They are elected by the eligible Zurich voters."],
    correct: 3
  },
  {
    id: 114,
    category: "Demokratie und Föderalismus",
    level: "Kanton",
    question: "Wer stellt im Kanton Zürich die Führerausweise für Autofahrerinnen und Autofahrer aus?",
    questionEn: "Who issues the driving licenses for car drivers in the Canton of Zurich?",
    options: ["die Gemeinde", "das Strassenverkehrsamt", "die Verkehrsverbände", "die Verkehrspolizei"],
    optionsEn: ["the municipality", "the Road Traffic Office", "the transport associations", "the traffic police"],
    correct: 1
  },
  {
    id: 117,
    category: "Demokratie und Föderalismus",
    level: "Gemeinde",
    question: "Was passiert an einer Gemeindeversammlung?",
    questionEn: "What happens at a municipal assembly?",
    options: ["Die Stimmbürgerinnen und Stimmbürger entscheiden über das Budget.", "Die Einwohnerinnen und Einwohner feiern ein Fest.", "Die Stimmbürgerinnen und Stimmbürger wählen den Chef oder die Chefin der Feuerwehr.", "Die Stimmbürgerinnen und Stimmbürger beschliessen neue nationale Gesetze."],
    optionsEn: ["The eligible voters decide on the budget.", "The residents celebrate a festival.", "The eligible voters elect the head of the fire brigade.", "The eligible voters pass new national laws."],
    correct: 0
  },
  {
    id: 119,
    category: "Demokratie und Föderalismus",
    level: "Gemeinde",
    question: "Was ist eine Aufgabe von Zürcher Gemeinden?",
    questionEn: "What is a task of the Zurich municipalities?",
    options: ["Sie bauen Autobahnen.", "Sie führen das Militär.", "Sie verkaufen Versicherungen.", "Sie organisieren die Primarschule."],
    optionsEn: ["They build highways.", "They lead the military.", "They sell insurance policies.", "They organize primary school."],
    correct: 3
  },
  {
    id: 120,
    category: "Demokratie und Föderalismus",
    level: "Gemeinde",
    question: "Wer erteilt die Baubewilligung für ein Einfamilienhaus im Kanton Zürich?",
    questionEn: "Who issues the building permit for a single-family house in the Canton of Zurich?",
    options: ["der Nachbar", "die Gemeinde", "das Quartierkomitee", "die Architektin"],
    optionsEn: ["the neighbour", "the municipality", "the neighbourhood committee", "the architect"],
    correct: 1
  },
  {
    id: 126,
    category: "Demokratie und Föderalismus",
    level: "Gemeinde",
    question: "Wie viele Gemeinden gibt es im Kanton Zürich?",
    questionEn: "How many municipalities are there in the Canton of Zurich?",
    options: ["zwischen 30 und 50", "zwischen 150 und 170", "zwischen 420 und 440", "zwischen 300 und 320"],
    optionsEn: ["between 30 and 50", "between 150 and 170", "between 420 and 440", "between 300 and 320"],
    correct: 1
  },
  {
    id: 130,
    category: "Sozialstaat und Zivilgesellschaft",
    level: "Bund",
    question: "Welche Versicherung im Gesundheitswesen ist Pflicht?",
    questionEn: "Which insurance in the healthcare system is mandatory?",
    options: ["die Versicherung für Alternativmedizin", "die zahnmedizinische Versicherung", "die Zusatzversicherung", "die obligatorische Krankenpflegeversicherung"],
    optionsEn: ["insurance for alternative medicine", "dental insurance", "supplementary insurance", "mandatory health care insurance"],
    correct: 3
  },
  {
    id: 139,
    category: "Sozialstaat und Zivilgesellschaft",
    level: "Bund",
    question: "Was ist die erste Säule der Altersvorsorge?",
    questionEn: "What is the first pillar of old-age provision?",
    options: ["das bedingungslose Grundeinkommen", "die Pensionskasse", "der Grundpfeiler des Schweizer Parlamentsgebäudes", "die AHV (Alters-, Hinterlassenen- und Invalidenversicherung)"],
    optionsEn: ["the unconditional basic income", "the pension fund", "the foundation pillar of the Swiss Parliament building", "the AHV (Old-Age, Survivors' and Invalidity Insurance)"],
    correct: 3
  },
  {
    id: 145,
    category: "Sozialstaat und Zivilgesellschaft",
    level: "Bund",
    question: "Was bedeutet AHV?",
    questionEn: "What does AHV stand for?",
    options: ["Alters- und Hinterlassenenversicherung", "Auto- und Heimreiseversicherung", "Arbeits- und Haushaltsversicherung", "Amt für Hausverwaltung"],
    optionsEn: ["Old-Age and Survivors' Insurance", "Car and Home Travel Insurance", "Work and Household Insurance", "Office for House Administration"],
    correct: 0
  },
  {
    id: 161,
    category: "Sozialstaat und Zivilgesellschaft",
    level: "Bund",
    question: "Wie viele Jahre dauert in der Schweiz die obligatorische Schulzeit?",
    questionEn: "How many years does compulsory schooling last in Switzerland?",
    options: ["11 Jahre", "13 Jahre", "8 Jahre", "6 Jahre"],
    optionsEn: ["11 years", "13 years", "8 years", "6 years"],
    correct: 0
  },
  {
    id: 213,
    category: "Geschichte",
    level: "Bund",
    question: "Welche Bedeutung hat das Jahr 1848 für die Geschichte der Schweiz?",
    questionEn: "What is the significance of the year 1848 for the history of Switzerland?",
    options: ["Gründung des Schweizer Bundesstaates", "Garantie der Neutralität durch die europäischen Mächte", "Niederlage eidgenössischer Truppen bei Marignano", "Unabhängigkeit vom Heiligen Römischen Reich"],
    optionsEn: ["Founding of the Swiss Federal State", "Guarantee of neutrality by the European powers", "Defeat of federal troops at Marignano", "Independence from the Holy Roman Empire"],
    correct: 0
  },
  {
    id: 217,
    category: "Geschichte",
    level: "Bund",
    question: "Wann haben Schweizer Frauen das Stimm- und Wahlrecht auf Bundesebene bekommen?",
    questionEn: "When did Swiss women get the right to vote and elect at the federal level?",
    options: ["1918", "1971", "1948", "1988"],
    optionsEn: ["1918", "1971", "1948", "1988"],
    correct: 1
  },
  {
    id: 226,
    category: "Geschichte",
    level: "Bund",
    question: "Welche Urkantone schlossen sich 1291 zu einem Bündnis zusammen?",
    questionEn: "Which original cantons formed an alliance in 1291?",
    options: ["St. Gallen, Thurgau, Schaffhausen", "Genf, Waadt, Freiburg", "Bern, Zürich, Zug", "Uri, Schwyz, Unterwalden"],
    optionsEn: ["St. Gallen, Thurgau, Schaffhausen", "Geneva, Vaud, Fribourg", "Bern, Zurich, Zug", "Uri, Schwyz, Unterwalden"],
    correct: 3
  },
  {
    id: 243,
    category: "Geschichte",
    level: "Bund",
    question: "Wer war Wilhelm Tell?",
    questionEn: "Who was William Tell?",
    options: ["ein eidgenössischer Söldner in fremden Diensten", "eine Innerschweizer Sagenfigur, die gegen fremde Herrscher kämpfte", "ein adliger Grundherr im Schweizer Mittelland", "ein Anführer im Bauernkrieg"],
    optionsEn: ["a Confederate mercenary in foreign service", "a legend figure from Central Switzerland who fought against foreign rulers", "a noble landowner in the Swiss Plateau", "a leader in the Peasants' War"],
    correct: 1
  },
  {
    id: 252,
    category: "Geschichte",
    level: "Kanton",
    question: "Ulrich Zwingli (1484-1531) war ein bekannter...",
    questionEn: "Ulrich Zwingli (1484-1531) was a famous...",
    options: ["Reformator in Zürich.", "Unternehmer.", "Naturwissenschaftler.", "Musiker."],
    optionsEn: ["reformer in Zurich.", "entrepreneur.", "natural scientist.", "musician."],
    correct: 0
  },
  {
    id: 257,
    category: "Geografie",
    level: "Bund",
    question: "Was ist am Gotthard-Basis-Tunnel speziell?",
    questionEn: "What is special about the Gotthard Base Tunnel?",
    options: ["Er war der erste Tunnel in Europa.", "Er ist der einzige Eisenbahntunnel Europas.", "Er ist der längste Eisenbahntunnel der Welt.", "Er hat den grössten Tunneldurchmesser der Welt."],
    optionsEn: ["It was the first tunnel in Europe.", "It is the only railway tunnel in Europe.", "It is the longest railway tunnel in the world.", "It has the largest tunnel diameter in the world."],
    correct: 2
  },
  {
    id: 276,
    category: "Geografie",
    level: "Bund",
    question: "Wie heisst die grösste Stadt der Schweiz?",
    questionEn: "What is the name of the largest city in Switzerland?",
    options: ["Zürich", "Basel", "Bern", "Genf"],
    optionsEn: ["Zurich", "Basel", "Bern", "Geneva"],
    correct: 0
  },
  {
    id: 294,
    category: "Geografie",
    level: "Kanton",
    question: "In welcher Gemeinde liegt der Flughafen Zürich?",
    questionEn: "In which municipality is Zurich Airport located?",
    options: ["Zürich", "Winterthur", "Kloten", "Bülach"],
    optionsEn: ["Zurich", "Winterthur", "Kloten", "Bülach"],
    correct: 2
  },
  {
    id: 297,
    category: "Geografie",
    level: "Kanton",
    question: "Welcher Fluss fliesst in der Stadt Zürich in die Limmat?",
    questionEn: "Which river flows into the Limmat in the city of Zurich?",
    options: ["Sihl", "Aare", "Rhone", "Tessin"],
    optionsEn: ["Sihl", "Aare", "Rhône", "Ticino"],
    correct: 0
  },
  {
    id: 296,
    category: "Geografie",
    level: "Kanton",
    question: "Wie heisst der zweitgrösste See des Kantons Zürich?",
    questionEn: "What is the name of the second largest lake in the Canton of Zurich?",
    options: ["Walensee", "Zugersee", "Sihlsee", "Greifensee"],
    optionsEn: ["Lake Walen", "Lake Zug", "Lake Sihl", "Lake Greifen"],
    correct: 3
  },
  {
    id: 305,
    category: "Kultur und Alltagskultur",
    level: "Bund",
    question: "Wie heisst das traditionelle Kartenspiel der Schweiz?",
    questionEn: "What is the name of the traditional Swiss card game?",
    options: ["Uno", "Jass", "Poker", "Bridge"],
    optionsEn: ["Uno", "Jass", "Poker", "Bridge"],
    correct: 1
  },
  {
    id: 309,
    category: "Kultur und Alltagskultur",
    level: "Bund",
    question: "Wann ist der Schweizer Nationalfeiertag?",
    questionEn: "When is the Swiss National Day?",
    options: ["14. Juli", "1. August", "4. Juli", "3. Oktober"],
    optionsEn: ["July 14th", "August 1st", "July 4th", "October 3rd"],
    correct: 1
  },
  {
    id: 349,
    category: "Kultur und Alltagskultur",
    level: "Kanton",
    question: "Wer spielt eine wichtige Rolle am Zürcher Sechseläuten?",
    questionEn: "Who plays an important role in the Zurich Sechseläuten?",
    options: ["die Frauen", "die Kirchen", "die Gewerkschaften", "die Zünfte"],
    optionsEn: ["the women", "the churches", "the unions", "the guilds"],
    correct: 3
  },
  {
    id: 342,
    category: "Kultur und Alltagskultur",
    level: "Kanton",
    question: "Man sagt: Je schneller am Sechseläuten der «Böögg» (Schneemann-Puppe) auf dem Scheiterhaufen den Kopf verliert, desto ...",
    questionEn: "It is said that the faster the 'Böögg' (snowman effigy) loses its head on the pyre at the Sechseläuten, the...",
    options: ["kälter wird der Zürichsee im Sommer.", "schöner wird der nächste Sommer.", "mehr Kinder wird es im kommenden Jahr geben.", "besser wird die Wirtschaft im kommenden Jahr laufen."],
    optionsEn: ["colder Lake Zurich will be in summer.", "nicer the next summer will be.", "more children there will be in the coming year.", "better the economy will perform in the coming year."],
    correct: 1
  }
];

// --- COMPONENTS ---

const Card = ({ children, className = "", onClick }) => (
  <div 
    onClick={onClick}
    className={`bg-white rounded-xl shadow-md overflow-hidden border border-slate-200 ${className}`}
  >
    {children}
  </div>
);

const Button = ({ children, onClick, variant = "primary", className = "", disabled = false, icon: Icon }) => {
  const baseStyle = "px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 disabled:bg-red-300",
    secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200 active:bg-slate-300",
    outline: "border-2 border-red-600 text-red-600 hover:bg-red-50",
    correct: "bg-green-100 text-green-800 border-2 border-green-500",
    incorrect: "bg-red-100 text-red-800 border-2 border-red-500",
    neutral: "bg-white border-2 border-slate-200 hover:border-red-400 text-slate-700",
    text: "bg-transparent text-slate-500 hover:text-red-600 hover:bg-slate-50"
  };

  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {Icon && <Icon size={18} />}
      {children}
    </button>
  );
};

// --- LOGIC: SMART LEARNING SYSTEM ---

const useSmartLearning = () => {
  // Structure: { [questionId]: { correctCount: 0, incorrectCount: 0, lastResult: 'correct' | 'incorrect' } }
  const [progress, setProgress] = useState({});

  const updateProgress = (questionId, isCorrect) => {
    setProgress(prev => {
      const current = prev[questionId] || { correctCount: 0, incorrectCount: 0, lastResult: null };
      return {
        ...prev,
        [questionId]: {
          correctCount: current.correctCount + (isCorrect ? 1 : 0),
          incorrectCount: current.incorrectCount + (!isCorrect ? 1 : 0),
          lastResult: isCorrect ? 'correct' : 'incorrect'
        }
      };
    });
  };

  const getWeightedQuestions = (allQuestions, count = 15) => {
    // Weight calculation:
    // Base weight = 1
    // +2 if last answer was incorrect
    // +1 for every incorrect answer total
    // +0.5 if never answered
    // -1 for every correct answer (min weight 0.1)
    
    const weightedQuestions = allQuestions.map(q => {
      const stats = progress[q.id] || { correctCount: 0, incorrectCount: 0, lastResult: null };
      
      let weight = 1;
      if (stats.lastResult === 'incorrect') weight += 2;
      weight += stats.incorrectCount * 1;
      if (stats.lastResult === null) weight += 0.5; // Slightly prefer new questions
      weight -= stats.correctCount * 0.8;
      
      return { ...q, weight: Math.max(0.1, weight) };
    });

    // Weighted random selection
    const selected = [];
    const pool = [...weightedQuestions];
    
    for (let i = 0; i < count; i++) {
      if (pool.length === 0) break;
      
      const totalWeight = pool.reduce((sum, q) => sum + q.weight, 0);
      let randomVal = Math.random() * totalWeight;
      
      let selectedIndex = -1;
      for (let j = 0; j < pool.length; j++) {
        randomVal -= pool[j].weight;
        if (randomVal <= 0) {
          selectedIndex = j;
          break;
        }
      }
      // Fallback for rounding errors
      if (selectedIndex === -1) selectedIndex = pool.length - 1;

      selected.push(pool[selectedIndex]);
      pool.splice(selectedIndex, 1);
    }
    
    return selected;
  };

  const getWeakestQuestions = (allQuestions) => {
    return allQuestions.filter(q => {
      const stats = progress[q.id];
      return !stats || stats.incorrectCount > stats.correctCount || stats.lastResult === 'incorrect';
    });
  };

  return { progress, updateProgress, getWeightedQuestions, getWeakestQuestions };
};

// --- SCREENS ---

const WelcomeScreen = ({ onStart, onStartFlashcards, progress }) => {
  // Calculate simple stats
  const totalAnswered = Object.keys(progress).length;
  const correctAnswers = Object.values(progress).reduce((sum, p) => sum + p.correctCount, 0);
  const totalAttempts = Object.values(progress).reduce((sum, p) => sum + p.correctCount + p.incorrectCount, 0);
  const masteryRate = totalAttempts > 0 ? Math.round((correctAnswers / totalAttempts) * 100) : 0;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 space-y-8 animate-fade-in">
      <div className="space-y-4 max-w-2xl">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <SwissFlag size={64} />
        </div>
        <h1 className="text-4xl font-bold text-slate-800">Grundkenntnistest Zürich</h1>
        <p className="text-lg text-slate-600">
          Bereiten Sie sich optimal auf Ihr Einbürgerungsgespräch und den Kantonalen Test vor.
          Das System lernt mit und wiederholt schwierige Fragen öfter.
        </p>
      </div>

      {/* Stats Mini-Dashboard */}
      {totalAnswered > 0 && (
        <div className="flex gap-6 justify-center w-full max-w-md bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-800">{totalAnswered}</div>
            <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Fragen gesehen</div>
          </div>
          <div className="w-px bg-slate-200"></div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${masteryRate >= 80 ? 'text-green-600' : 'text-slate-800'}`}>{masteryRate}%</div>
            <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Erfolgsquote</div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer group" onClick={onStart}>
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-red-50 rounded-full group-hover:bg-red-100 transition-colors">
              <BookOpen className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Smart Quiz</h3>
            <p className="text-slate-500 text-sm">
              Intelligenter Testmodus. Fragen, die Sie falsch beantworten, kommen öfter dran.
            </p>
            <Button 
              className="w-full"
              onClick={(e) => {
                e.stopPropagation();
                onStart();
              }}
            >
              <Zap size={18} /> Quiz Starten
            </Button>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer group" onClick={onStartFlashcards}>
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-slate-100 rounded-full group-hover:bg-slate-200 transition-colors">
              <Layers className="w-8 h-8 text-slate-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Lernkarten</h3>
            <p className="text-slate-500 text-sm">
              Lernen Sie entspannt. Sie können wählen, ob Sie alle oder nur schwierige Karten sehen wollen.
            </p>
            <Button 
              variant="secondary" 
              className="w-full"
              onClick={(e) => {
                e.stopPropagation();
                onStartFlashcards();
              }}
            >
              Karten Öffnen
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

const QuizScreen = ({ questions, onFinish, onExit, onAnswer }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showTranslate, setShowTranslate] = useState(false);

  const currentQuestion = questions[currentIndex];

  const handleOptionClick = (index) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    
    const isCorrect = index === currentQuestion.correct;
    if (isCorrect) {
      setScore(score + 1);
    }
    // Update Smart Learning System
    onAnswer(currentQuestion.id, isCorrect);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setShowTranslate(false);
    } else {
      onFinish(score, questions.length);
    }
  };

  // Progress Bar
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const displayQuestion = showTranslate ? currentQuestion.questionEn : currentQuestion.question;
  const displayOptions = showTranslate ? currentQuestion.optionsEn : currentQuestion.options;

  return (
    <div className="max-w-3xl mx-auto w-full px-4 py-6 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <button onClick={onExit} className="text-slate-500 hover:text-slate-700 flex items-center gap-1 text-sm font-medium">
          <Home size={16} /> Beenden
        </button>
        <div className="flex items-center gap-4">
           <button 
             onClick={() => setShowTranslate(!showTranslate)} 
             className={`flex items-center gap-1 text-sm font-medium px-3 py-1 rounded-full transition-colors ${showTranslate ? 'bg-red-100 text-red-700' : 'text-slate-500 hover:bg-slate-100'}`}
           >
             <Globe size={16} />
             {showTranslate ? 'Deutsch' : 'English'}
           </button>
           <span className="text-sm font-bold text-slate-500">
             Frage {currentIndex + 1} / {questions.length}
           </span>
        </div>
      </div>

      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
        <div 
          className="bg-red-600 h-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <Card className="p-8">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-bold uppercase rounded-full tracking-wide">
              {currentQuestion.category}
            </span>
            <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold uppercase rounded-full tracking-wide">
              {currentQuestion.level}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 leading-snug min-h-[4rem]">
            {displayQuestion}
          </h2>
        </div>

        <div className="space-y-3">
          {displayOptions.map((option, idx) => {
            let variant = "neutral";
            if (isAnswered) {
              if (idx === currentQuestion.correct) variant = "correct";
              else if (idx === selectedOption) variant = "incorrect";
            } else if (idx === selectedOption) {
              variant = "outline";
            }

            return (
              <button
                key={idx}
                onClick={() => handleOptionClick(idx)}
                disabled={isAnswered}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 flex justify-between items-center group
                  ${variant === 'neutral' ? 'border-slate-200 hover:border-red-300 hover:bg-red-50' : ''}
                  ${variant === 'correct' ? 'border-green-500 bg-green-50 text-green-900' : ''}
                  ${variant === 'incorrect' ? 'border-red-500 bg-red-50 text-red-900 opacity-60' : ''}
                `}
              >
                <span className="font-medium text-lg">{option}</span>
                {variant === 'correct' && <CheckCircle className="text-green-600 shrink-0" />}
                {variant === 'incorrect' && <XCircle className="text-red-600 shrink-0" />}
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div className="mt-8 flex justify-end animate-fade-in">
            <Button onClick={handleNext} className="px-8 py-3 text-lg">
              {currentIndex === questions.length - 1 ? "Ergebnis ansehen" : "Nächste Frage"}
              <ChevronRight size={20} />
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

const FlashcardScreen = ({ questions, weakestQuestions, onExit }) => {
  const [mode, setMode] = useState('all'); // 'all' or 'weak'
  const activeSet = mode === 'all' ? questions : weakestQuestions;
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showTranslate, setShowTranslate] = useState(false);

  // Reset index when mode changes
  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [mode]);

  const handleNext = () => {
    setIsFlipped(false);
    setShowTranslate(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % activeSet.length);
    }, 200);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setShowTranslate(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + activeSet.length) % activeSet.length);
    }, 200);
  };

  // Guard for empty weakest set
  if (activeSet.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center p-4">
        <Trophy className="w-16 h-16 text-yellow-400 mb-4" />
        <h2 className="text-2xl font-bold text-slate-800">Alles perfekt!</h2>
        <p className="text-slate-600 mb-6">Sie haben momentan keine "schwierigen" Fragen markiert. Super!</p>
        <div className="flex gap-4">
          <Button onClick={() => setMode('all')}>Alle Karten anzeigen</Button>
          <Button variant="secondary" onClick={onExit}>Zurück</Button>
        </div>
      </div>
    );
  }

  const currentQuestion = activeSet[currentIndex];
  const displayQuestion = showTranslate ? currentQuestion.questionEn : currentQuestion.question;
  const displayAnswer = showTranslate ? currentQuestion.optionsEn[currentQuestion.correct] : currentQuestion.options[currentQuestion.correct];

  return (
    <div className="max-w-2xl mx-auto w-full px-4 py-8 flex flex-col items-center h-[85vh]">
      <div className="w-full flex justify-between items-center mb-6">
        <button onClick={onExit} className="text-slate-500 hover:text-slate-700 flex items-center gap-1 font-medium">
          <Home size={18} /> Zurück
        </button>
        <div className="flex gap-2">
          {/* Mode Toggle */}
          <div className="bg-slate-100 p-1 rounded-lg flex text-sm font-medium">
            <button 
              onClick={() => setMode('all')}
              className={`px-3 py-1 rounded-md transition-colors ${mode === 'all' ? 'bg-white shadow text-slate-800' : 'text-slate-500'}`}
            >
              Alle
            </button>
            <button 
              onClick={() => setMode('weak')}
              className={`px-3 py-1 rounded-md transition-colors flex items-center gap-1 ${mode === 'weak' ? 'bg-white shadow text-red-600' : 'text-slate-500'}`}
            >
              <Brain size={14} /> Fokus ({weakestQuestions.length})
            </button>
          </div>
        </div>
      </div>

      <div className="w-full flex justify-end mb-4">
         <button 
             onClick={() => setShowTranslate(!showTranslate)} 
             className={`flex items-center gap-1 text-sm font-medium px-3 py-1 rounded-full transition-colors ${showTranslate ? 'bg-red-100 text-red-700' : 'text-slate-500 hover:bg-slate-100'}`}
           >
             <Globe size={16} />
             {showTranslate ? 'Deutsch' : 'English'}
           </button>
      </div>

      <div className="flex-1 w-full perspective-1000 relative group cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
        <div className={`relative w-full h-full transition-all duration-500 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
          
          {/* Front */}
          <div className="absolute w-full h-full backface-hidden">
            <Card className="h-full flex flex-col justify-center items-center p-8 text-center bg-white border-b-4 border-b-red-600">
               <div className="absolute top-6 left-6 flex gap-2">
                <span className="px-2 py-1 bg-slate-100 rounded text-xs text-slate-500 font-bold uppercase">{currentQuestion.category}</span>
                <span className="px-2 py-1 bg-red-50 rounded text-xs text-red-600 font-bold uppercase">{currentQuestion.level}</span>
               </div>
               <h3 className="text-2xl font-bold text-slate-800 leading-relaxed">{displayQuestion}</h3>
               <p className="mt-8 text-slate-400 text-sm animate-pulse">Klicken zum Umdrehen</p>
            </Card>
          </div>

          {/* Back */}
          <div className="absolute w-full h-full backface-hidden rotate-y-180">
            <Card className="h-full flex flex-col justify-center items-center p-8 text-center bg-red-50 border-b-4 border-b-red-600">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Richtige Antwort</h3>
              <p className="text-2xl font-medium text-red-900 leading-relaxed">
                {displayAnswer}
              </p>
            </Card>
          </div>

        </div>
      </div>

      <div className="flex gap-4 mt-8 w-full justify-center items-center">
        <Button variant="secondary" onClick={handlePrev} className="px-6">
           <ChevronLeft size={20} /> Zurück
        </Button>
        <span className="text-slate-400 font-medium text-sm">
          {currentIndex + 1} / {activeSet.length}
        </span>
        <Button onClick={handleNext} className="px-6">
           Nächste Karte <ChevronRight size={20} />
        </Button>
      </div>
    </div>
  );
};

const ResultScreen = ({ score, total, onRestart, onHome }) => {
  const percentage = Math.round((score / total) * 100);
  let message = "";
  let subMessage = "";
  
  if (percentage >= 90) {
    message = "Hervorragend!";
    subMessage = "Sie sind bestens vorbereitet. Das System hat Ihre Ergebnisse gespeichert.";
  } else if (percentage >= 70) {
    message = "Gut gemacht!";
    subMessage = "Solide Leistung. Wir werden die schwierigen Fragen beim nächsten Mal wiederholen.";
  } else {
    message = "Weiter üben!";
    subMessage = "Keine Sorge, das System merkt sich Ihre Fehler und hilft Ihnen beim Lernen.";
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-fade-in">
      <div className="relative mb-8">
        <Trophy className={`w-32 h-32 ${percentage >= 70 ? 'text-yellow-400' : 'text-slate-300'}`} />
        {percentage >= 70 && (
          <div className="absolute -top-2 -right-2 bg-red-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold shadow-lg animate-bounce">
            {percentage}%
          </div>
        )}
      </div>

      <h2 className="text-4xl font-bold text-slate-800 mb-2">{message}</h2>
      <p className="text-xl text-slate-600 mb-8 max-w-md">{subMessage}</p>

      <Card className="p-6 mb-8 w-full max-w-sm bg-slate-50">
        <div className="flex justify-between items-center text-lg font-medium border-b border-slate-200 pb-4 mb-4">
          <span className="text-slate-600">Erreichte Punkte</span>
          <span className="text-slate-900 font-bold">{score} / {total}</span>
        </div>
        <div className="flex justify-between items-center text-lg font-medium">
          <span className="text-slate-600">Quote</span>
          <span className={`font-bold ${percentage >= 60 ? 'text-green-600' : 'text-red-500'}`}>{percentage}%</span>
        </div>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
        <Button onClick={onRestart} className="flex-1">
          <RefreshCw size={18} /> Nochmals versuchen
        </Button>
        <Button variant="secondary" onClick={onHome} className="flex-1">
          <Home size={18} /> Hauptmenü
        </Button>
      </div>
    </div>
  );
};

// --- APP CONTAINER ---

const App = () => {
  const [screen, setScreen] = useState('welcome'); // welcome, quiz, flashcards, results
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [activeQuestions, setActiveQuestions] = useState([]);
  
  // Initialize Smart Learning Hook
  const { progress, updateProgress, getWeightedQuestions, getWeakestQuestions } = useSmartLearning();

  const startQuiz = () => {
    // Get questions weighted by difficulty/history
    const selection = getWeightedQuestions(QUESTIONS_DATA, 15);
    setActiveQuestions(selection);
    setScore(0);
    setScreen('quiz');
  };

  const startFlashcards = () => {
    // Pass all questions to flashcards, logic handles filtering inside component
    setActiveQuestions(QUESTIONS_DATA); 
    setScreen('flashcards');
  };

  const finishQuiz = (finalScore, total) => {
    setScore(finalScore);
    setQuestionCount(total);
    setScreen('results');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-red-100 selection:text-red-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setScreen('welcome')}>
            <SwissFlag size={28} className="drop-shadow-sm" />
            <span className="font-bold text-xl tracking-tight hidden sm:block">Zürich<span className="text-red-600">Einbürgerung</span></span>
          </div>
          <div className="flex items-center gap-4">
             {screen !== 'welcome' && (
               <span className="text-xs font-bold bg-slate-100 text-slate-600 px-3 py-1 rounded-full uppercase tracking-wider">
                  {screen === 'quiz' ? 'Prüfung' : screen === 'flashcards' ? 'Training' : 'Ergebnis'}
               </span>
             )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto p-4 md:py-8">
        {screen === 'welcome' && (
          <WelcomeScreen 
            onStart={startQuiz} 
            onStartFlashcards={startFlashcards} 
            progress={progress} 
          />
        )}
        {screen === 'quiz' && (
          <QuizScreen 
            questions={activeQuestions} 
            onAnswer={updateProgress}
            onFinish={finishQuiz} 
            onExit={() => setScreen('welcome')} 
          />
        )}
        {screen === 'flashcards' && (
          <FlashcardScreen 
            questions={QUESTIONS_DATA}
            weakestQuestions={getWeakestQuestions(QUESTIONS_DATA)}
            onExit={() => setScreen('welcome')} 
          />
        )}
        {screen === 'results' && (
          <ResultScreen 
            score={score} 
            total={questionCount} 
            onRestart={startQuiz} 
            onHome={() => setScreen('welcome')} 
          />
        )}
      </main>

      {/* Styles for flip animation */}
      <style jsx>{`
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
        .animate-fade-in { animation: fadeIn 0.5s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default App;