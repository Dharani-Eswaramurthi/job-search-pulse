const SURVEY = {
  "title": "Job Search Pulse — What are applicants experiencing?",
  "description": "I'm an AI Engineer actively looking for a job change. I'm collecting job seekers' experiences across countries and industries to understand what applying for work currently feels like. This survey takes approximately 5–7 minutes; estimates are fine, and you do not need to count applications or rejections. Please answer about the past 30 days unless a question says otherwise.\n\nThe form does not request your name, email, employer or CV. Age, state/province and written feedback are optional. Please do not include names, contact details or identifying stories in written answers. Responses will be used to produce grouped findings, potentially on a public dashboard, and to inform a possible company hiring-experience review platform. Individual responses and written feedback will not be published verbatim. Participation is voluntary; you can leave before submitting. Please submit once for this survey round. This is an independent community survey, not a job application or recruitment service.",
  "sections": [
    {
      "id": "welcome",
      "title": "Before you begin",
      "questions": [
        {
          "id": "consent",
          "type": "choice",
          "required": true,
          "title": "Are you happy to take part on the basis described above?",
          "options": [
            "Yes, I agree",
            "No, I do not want to take part"
          ],
          "routes": [
            "profile",
            "SUBMIT"
          ]
        }
      ]
    },
    {
      "id": "profile",
      "title": "Your current situation",
      "questions": [
        {
          "id": "search_status",
          "type": "choice",
          "required": true,
          "title": "Are you currently looking for a job?",
          "options": [
            "Actively applying or interviewing",
            "Looking, but have not started applying",
            "Open to opportunities, but not actively searching",
            "Recently finished my search / accepted an offer",
            "Not currently looking"
          ]
        },
        {
          "id": "employment_status",
          "type": "choice",
          "required": true,
          "title": "Which best describes your current work situation?",
          "options": [
            "Unemployed and looking for work",
            "Employed, have not resigned, and exploring a change",
            "Serving notice and still looking for my next role",
            "Serving notice with my next role already secured",
            "Student / recent graduate seeking my first full-time role",
            "Freelancing / self-employed and seeking an employed role",
            "Returning after a career break",
            "Employed and not looking for a change",
            "Other situation",
            "Prefer not to say"
          ]
        },
        {
          "id": "experience",
          "type": "choice",
          "required": true,
          "title": "How much total professional work experience do you have?",
          "help": "Include paid internships and freelance work. Do not double-count overlapping roles.",
          "options": [
            "No professional experience yet",
            "Less than 1 year",
            "1 to less than 3 years",
            "3 to less than 5 years",
            "5 to less than 8 years",
            "8 to less than 12 years",
            "12 to less than 16 years",
            "16+ years",
            "Prefer not to say"
          ]
        },
        {
          "id": "target_level",
          "type": "choice",
          "required": true,
          "title": "What level of role are you mainly targeting?",
          "options": [
            "Internship / apprenticeship",
            "Entry-level / graduate / junior",
            "Mid-level individual contributor",
            "Senior individual contributor",
            "Lead / staff / principal specialist",
            "Manager / people manager",
            "Head / director",
            "Executive / VP / C-suite",
            "Open to multiple levels",
            "Not currently targeting a role"
          ]
        },
        {
          "id": "function",
          "type": "dropdown",
          "required": true,
          "title": "Which type of work best matches the roles you want?",
          "options": [
            "Software / IT / cybersecurity",
            "AI / machine learning / data / analytics",
            "Engineering / manufacturing / skilled trades",
            "Product / project / program management",
            "Design / creative / media / writing",
            "Sales / business development",
            "Marketing / communications",
            "Finance / accounting / audit",
            "HR / recruitment / people operations",
            "Customer service / operations / administration",
            "Healthcare / care work",
            "Education / research",
            "Legal / public policy",
            "Retail / hospitality / food service",
            "Transport / logistics / supply chain",
            "Other type of work",
            "Still exploring / not applicable"
          ]
        },
        {
          "id": "industry",
          "type": "dropdown",
          "required": true,
          "title": "Which industry are you mainly applying to?",
          "help": "Choose the employer's industry, rather than your job function. For example, a software role at a bank belongs to financial services.",
          "options": [
            "Technology / software / IT services",
            "Banking / financial services / insurance",
            "Healthcare / pharmaceuticals / biotechnology",
            "Manufacturing / automotive / aerospace",
            "Retail / e-commerce / consumer goods",
            "Education / research",
            "Professional services / consulting",
            "Media / entertainment / advertising",
            "Construction / real estate / infrastructure",
            "Energy / utilities / environment",
            "Transport / logistics",
            "Hospitality / travel / food service",
            "Government / public sector / nonprofit",
            "Agriculture / food production",
            "Multiple industries / no main industry",
            "Other industry",
            "Not currently applying"
          ]
        },
        {
          "id": "age_group",
          "type": "choice",
          "required": false,
          "title": "What is your age group? (Optional)",
          "options": [
            "Under 18",
            "18–24",
            "25–34",
            "35–44",
            "45–54",
            "55–64",
            "65+",
            "Prefer not to say"
          ]
        },
        {
          "id": "country",
          "type": "country",
          "required": true,
          "title": "Which country or territory do you currently live in?"
        }
      ]
    },
    {
      "id": "search",
      "title": "Your job search",
      "questions": [
        {
          "id": "target_market",
          "type": "choice",
          "required": true,
          "title": "Where are the roles you are targeting mainly based?",
          "options": [
            "In the country where I currently live",
            "In another country",
            "Across several countries / international remote roles",
            "Not sure / not currently targeting roles"
          ]
        },
        {
          "id": "target_country",
          "type": "text",
          "required": false,
          "title": "If you are mainly targeting another country, which one? (Optional)",
          "help": "Country name only; leave blank if this does not apply."
        },
        {
          "id": "search_duration",
          "type": "choice",
          "required": true,
          "title": "How long have you been looking during your current or most recent job search?",
          "options": [
            "Have not started yet",
            "Less than 1 month",
            "1 to less than 3 months",
            "3 to less than 6 months",
            "6 to less than 12 months",
            "12+ months",
            "Not applicable"
          ]
        },
        {
          "id": "work_arrangement",
          "type": "checkbox",
          "required": false,
          "title": "Which work arrangements would you consider? (Select all that apply)",
          "options": [
            "On-site",
            "Hybrid",
            "Fully remote"
          ]
        },
        {
          "id": "recent_activity",
          "type": "choice",
          "required": true,
          "title": "In the past 30 days, have you applied for a role or taken part in a hiring process?",
          "help": "Include referrals and processes started by a recruiter contacting you.",
          "options": [
            "Yes",
            "No"
          ],
          "routes": [
            "applications",
            "outlook"
          ]
        }
      ]
    },
    {
      "id": "applications",
      "title": "Applications and employer responses",
      "help": "Think about the past 30 days. Estimates are enough. Choose 'not applicable' where a question does not fit your experience.",
      "questions": [
        {
          "id": "channels",
          "type": "checkbox",
          "required": true,
          "title": "Which channels have you used to apply or enter a hiring process? (Select all that apply)",
          "options": [
            "LinkedIn",
            "Indeed",
            "Naukri",
            "Foundit / Monster",
            "Glassdoor",
            "Wellfound / startup job boards",
            "Other local or industry-specific job boards",
            "Company career websites",
            "Employee referrals / personal network",
            "Recruiters / staffing agencies contacting me",
            "Direct email / direct messages to employers",
            "University / campus placement / career fairs",
            "Government employment services",
            "Other channel"
          ]
        },
        {
          "id": "daily_applications",
          "type": "choice",
          "required": true,
          "title": "On days when you apply, roughly how many applications do you submit?",
          "help": "Think of a typical application day in the past 30 days. Exclude days when you did not apply; an estimate is fine.",
          "options": [
            "I did not submit applications; I was only interviewing or contacted by recruiters",
            "1–2",
            "3–5",
            "6–10",
            "11–20",
            "21+",
            "It varies too much / not sure"
          ]
        },
        {
          "id": "application_days",
          "type": "choice",
          "required": false,
          "title": "During the past 30 days, how often did you spend time applying? (Optional)",
          "options": [
            "Less than once a week",
            "1–2 days a week",
            "3–4 days a week",
            "5–7 days a week",
            "Did not submit applications"
          ]
        },
        {
          "id": "response_share",
          "type": "choice",
          "required": true,
          "title": "For applications submitted 14–30 days ago, about how many have received a decision or next-step response?",
          "help": "Count rejections and invitations to proceed, including automated decisions. Exclude simple 'application received' confirmations. Ignore applications sent less than 14 days ago.",
          "options": [
            "None",
            "Almost none / very few",
            "Fewer than half",
            "About half (roughly 50/50)",
            "More than half",
            "Almost all / all",
            "Not sure",
            "Not applicable — no applications submitted 14–30 days ago"
          ]
        },
        {
          "id": "positive_share",
          "type": "choice",
          "required": true,
          "title": "For those same applications submitted 14–30 days ago, about how many led to an invitation to a next step?",
          "help": "Examples: a recruiter call, assessment, interview or offer. Use all applications in that period as the reference, not only applications that received a reply.",
          "options": [
            "None",
            "Almost none / very few",
            "Fewer than half",
            "About half (roughly 50/50)",
            "More than half",
            "Almost all / all",
            "Not sure",
            "Not applicable — no applications submitted 14–30 days ago"
          ]
        },
        {
          "id": "furthest_stage",
          "type": "choice",
          "required": true,
          "title": "What is the furthest hiring stage you reached or completed in the past 30 days?",
          "help": "Include ongoing processes that started earlier. An invitation to interview is different from completing an interview.",
          "options": [
            "Application submitted / acknowledgment only",
            "Recruiter conversation or screening call",
            "Assessment / take-home task completed",
            "Interview completed",
            "Final interview / reference or background checks",
            "Verbal offer only",
            "Written offer received",
            "Offer accepted / started the role",
            "Other stage / not sure"
          ]
        },
        {
          "id": "ghosting_share",
          "type": "choice",
          "required": true,
          "title": "In the past 30 days, how often did an employer stop updating you after inviting you to proceed or speaking with you?",
          "help": "Count a process only if an agreed update date passed by at least 7 days, or there was no update for at least 14 days when no date was agreed. Exclude employers who rejected you, explained a delay or whose reply is not yet overdue. Answer across processes with enough time to judge.",
          "options": [
            "Never",
            "Very few of those processes",
            "Fewer than half",
            "About half (roughly 50/50)",
            "More than half",
            "Almost all / all",
            "Not sure",
            "Not applicable — no eligible processes / still waiting within the expected time"
          ]
        },
        {
          "id": "ghosting_stage",
          "type": "checkbox",
          "required": false,
          "title": "If this happened, after which stage(s) did communication stop? (Optional; select all that apply)",
          "options": [
            "Shortlist / invitation, before a conversation",
            "Recruiter conversation / screening",
            "Assessment / take-home task",
            "Interview",
            "Final interview / checks",
            "Verbal offer",
            "Written offer",
            "Other stage"
          ],
          "help": "Leave blank if this did not happen."
        }
      ]
    },
    {
      "id": "outlook",
      "title": "Your view of the market",
      "questions": [
        {
          "id": "difficulty",
          "type": "choice",
          "required": true,
          "title": "How easy or difficult is it to find openings that match your skills, level and location?",
          "options": [
            "Very easy",
            "Somewhat easy",
            "Neither easy nor difficult",
            "Somewhat difficult",
            "Very difficult",
            "Not sure / have not looked recently"
          ]
        },
        {
          "id": "market_change",
          "type": "choice",
          "required": false,
          "title": "Compared with around 3 months ago, how does your job search feel now? (Optional)",
          "options": [
            "Much easier",
            "Somewhat easier",
            "About the same",
            "Somewhat harder",
            "Much harder",
            "Cannot compare / was not searching then"
          ]
        },
        {
          "id": "feedback",
          "type": "paragraph",
          "required": false,
          "title": "What has stood out in your application experience, and how do you see the job market right now? (Optional)",
          "help": "A few sentences are enough. Positive, mixed and negative experiences are all welcome. Please do not name companies or people, or include contact details or identifying information. Written responses are for private thematic analysis and will not be published verbatim."
        },
        {
          "id": "review_features",
          "type": "checkbox",
          "required": false,
          "title": "If you used a company hiring-experience review platform, what would help you most? (Optional; choose up to 3)",
          "maxChoices": 3,
          "options": [
            "Whether applicants receive updates or closure",
            "Typical hiring timeline",
            "Clarity and accuracy of job descriptions",
            "Pay-range transparency",
            "Interview / assessment experience",
            "Whether advertised roles appear to be actively hiring",
            "Feedback after interviews",
            "Reviews from applicants in similar roles or regions",
            "How recent reviews are and how they are checked",
            "Other information",
            "I would not use a platform like this"
          ],
          "help": "If you would not use it, select only that option. This is an early idea; no account or signup is being requested."
        }
      ]
    }
  ],
  "locations": {
    "India": {
      "label": "State / union territory",
      "options": [
        "Andaman and Nicobar Islands",
        "Andhra Pradesh",
        "Arunachal Pradesh",
        "Assam",
        "Bihar",
        "Chandigarh",
        "Chhattisgarh",
        "Dadra and Nagar Haveli and Daman and Diu",
        "Delhi",
        "Goa",
        "Gujarat",
        "Haryana",
        "Himachal Pradesh",
        "Jammu and Kashmir",
        "Jharkhand",
        "Karnataka",
        "Kerala",
        "Ladakh",
        "Lakshadweep",
        "Madhya Pradesh",
        "Maharashtra",
        "Manipur",
        "Meghalaya",
        "Mizoram",
        "Nagaland",
        "Odisha",
        "Puducherry",
        "Punjab",
        "Rajasthan",
        "Sikkim",
        "Tamil Nadu",
        "Telangana",
        "Tripura",
        "Uttar Pradesh",
        "Uttarakhand",
        "West Bengal",
        "Other / not listed",
        "Prefer not to say"
      ]
    },
    "United States": {
      "label": "State / district / territory",
      "options": [
        "Alabama",
        "Alaska",
        "American Samoa",
        "Arizona",
        "Arkansas",
        "California",
        "Colorado",
        "Connecticut",
        "Delaware",
        "District of Columbia",
        "Florida",
        "Georgia",
        "Guam",
        "Hawaii",
        "Idaho",
        "Illinois",
        "Indiana",
        "Iowa",
        "Kansas",
        "Kentucky",
        "Louisiana",
        "Maine",
        "Maryland",
        "Massachusetts",
        "Michigan",
        "Minnesota",
        "Mississippi",
        "Missouri",
        "Montana",
        "Nebraska",
        "Nevada",
        "New Hampshire",
        "New Jersey",
        "New Mexico",
        "New York",
        "North Carolina",
        "North Dakota",
        "Northern Mariana Islands",
        "Ohio",
        "Oklahoma",
        "Oregon",
        "Pennsylvania",
        "Puerto Rico",
        "Rhode Island",
        "South Carolina",
        "South Dakota",
        "Tennessee",
        "Texas",
        "U.S. Virgin Islands",
        "Utah",
        "Vermont",
        "Virginia",
        "Washington",
        "West Virginia",
        "Wisconsin",
        "Wyoming",
        "Other / not listed",
        "Prefer not to say"
      ]
    },
    "Canada": {
      "label": "Province / territory",
      "options": [
        "Alberta",
        "British Columbia",
        "Manitoba",
        "New Brunswick",
        "Newfoundland and Labrador",
        "Northwest Territories",
        "Nova Scotia",
        "Nunavut",
        "Ontario",
        "Prince Edward Island",
        "Quebec",
        "Saskatchewan",
        "Yukon",
        "Other / not listed",
        "Prefer not to say"
      ]
    },
    "Australia": {
      "label": "State / territory",
      "options": [
        "Australian Capital Territory",
        "New South Wales",
        "Northern Territory",
        "Queensland",
        "South Australia",
        "Tasmania",
        "Victoria",
        "Western Australia",
        "Other / not listed",
        "Prefer not to say"
      ]
    },
    "United Kingdom": {
      "label": "UK nation",
      "options": [
        "England",
        "Northern Ireland",
        "Scotland",
        "Wales",
        "Other / not listed",
        "Prefer not to say"
      ]
    },
    "Germany": {
      "label": "Federal state",
      "options": [
        "Baden-Württemberg",
        "Bavaria",
        "Berlin",
        "Brandenburg",
        "Bremen",
        "Hamburg",
        "Hesse",
        "Lower Saxony",
        "Mecklenburg-Western Pomerania",
        "North Rhine-Westphalia",
        "Rhineland-Palatinate",
        "Saarland",
        "Saxony",
        "Saxony-Anhalt",
        "Schleswig-Holstein",
        "Thuringia",
        "Other / not listed",
        "Prefer not to say"
      ]
    },
    "United Arab Emirates": {
      "label": "Emirate",
      "options": [
        "Abu Dhabi",
        "Ajman",
        "Dubai",
        "Fujairah",
        "Ras Al Khaimah",
        "Sharjah",
        "Umm Al Quwain",
        "Other / not listed",
        "Prefer not to say"
      ]
    }
  },
  "countries": [
    "Afghanistan",
    "Albania",
    "Algeria",
    "American Samoa",
    "Andorra",
    "Angola",
    "Anguilla",
    "Antarctica",
    "Antigua & Barbuda",
    "Argentina",
    "Armenia",
    "Aruba",
    "Australia",
    "Austria",
    "Azerbaijan",
    "Bahamas",
    "Bahrain",
    "Bangladesh",
    "Barbados",
    "Belarus",
    "Belgium",
    "Belize",
    "Benin",
    "Bermuda",
    "Bhutan",
    "Bolivia",
    "Bosnia & Herzegovina",
    "Botswana",
    "Bouvet Island",
    "Brazil",
    "British Indian Ocean Territory",
    "British Virgin Islands",
    "Brunei",
    "Bulgaria",
    "Burkina Faso",
    "Burundi",
    "Cambodia",
    "Cameroon",
    "Canada",
    "Cape Verde",
    "Caribbean Netherlands",
    "Cayman Islands",
    "Central African Republic",
    "Chad",
    "Chile",
    "China",
    "Christmas Island",
    "Cocos (Keeling) Islands",
    "Colombia",
    "Comoros",
    "Congo - Brazzaville",
    "Congo - Kinshasa",
    "Cook Islands",
    "Costa Rica",
    "Croatia",
    "Cuba",
    "Curaçao",
    "Cyprus",
    "Czechia",
    "Côte d’Ivoire",
    "Denmark",
    "Djibouti",
    "Dominica",
    "Dominican Republic",
    "Ecuador",
    "Egypt",
    "El Salvador",
    "Equatorial Guinea",
    "Eritrea",
    "Estonia",
    "Eswatini",
    "Ethiopia",
    "Falkland Islands",
    "Faroe Islands",
    "Fiji",
    "Finland",
    "France",
    "French Guiana",
    "French Polynesia",
    "French Southern Territories",
    "Gabon",
    "Gambia",
    "Georgia",
    "Germany",
    "Ghana",
    "Gibraltar",
    "Greece",
    "Greenland",
    "Grenada",
    "Guadeloupe",
    "Guam",
    "Guatemala",
    "Guernsey",
    "Guinea",
    "Guinea-Bissau",
    "Guyana",
    "Haiti",
    "Heard & McDonald Islands",
    "Honduras",
    "Hong Kong SAR China",
    "Hungary",
    "Iceland",
    "India",
    "Indonesia",
    "Iran",
    "Iraq",
    "Ireland",
    "Isle of Man",
    "Israel",
    "Italy",
    "Jamaica",
    "Japan",
    "Jersey",
    "Jordan",
    "Kazakhstan",
    "Kenya",
    "Kiribati",
    "Kuwait",
    "Kyrgyzstan",
    "Laos",
    "Latvia",
    "Lebanon",
    "Lesotho",
    "Liberia",
    "Libya",
    "Liechtenstein",
    "Lithuania",
    "Luxembourg",
    "Macao SAR China",
    "Madagascar",
    "Malawi",
    "Malaysia",
    "Maldives",
    "Mali",
    "Malta",
    "Marshall Islands",
    "Martinique",
    "Mauritania",
    "Mauritius",
    "Mayotte",
    "Mexico",
    "Micronesia",
    "Moldova",
    "Monaco",
    "Mongolia",
    "Montenegro",
    "Montserrat",
    "Morocco",
    "Mozambique",
    "Myanmar (Burma)",
    "Namibia",
    "Nauru",
    "Nepal",
    "Netherlands",
    "New Caledonia",
    "New Zealand",
    "Nicaragua",
    "Niger",
    "Nigeria",
    "Niue",
    "Norfolk Island",
    "North Korea",
    "North Macedonia",
    "Northern Mariana Islands",
    "Norway",
    "Oman",
    "Pakistan",
    "Palau",
    "Palestinian Territories",
    "Panama",
    "Papua New Guinea",
    "Paraguay",
    "Peru",
    "Philippines",
    "Pitcairn Islands",
    "Poland",
    "Portugal",
    "Puerto Rico",
    "Qatar",
    "Romania",
    "Russia",
    "Rwanda",
    "Réunion",
    "Samoa",
    "San Marino",
    "Saudi Arabia",
    "Senegal",
    "Serbia",
    "Seychelles",
    "Sierra Leone",
    "Singapore",
    "Sint Maarten",
    "Slovakia",
    "Slovenia",
    "Solomon Islands",
    "Somalia",
    "South Africa",
    "South Georgia & South Sandwich Islands",
    "South Korea",
    "South Sudan",
    "Spain",
    "Sri Lanka",
    "St. Barthélemy",
    "St. Helena",
    "St. Kitts & Nevis",
    "St. Lucia",
    "St. Martin",
    "St. Pierre & Miquelon",
    "St. Vincent & Grenadines",
    "Sudan",
    "Suriname",
    "Svalbard & Jan Mayen",
    "Sweden",
    "Switzerland",
    "Syria",
    "São Tomé & Príncipe",
    "Taiwan",
    "Tajikistan",
    "Tanzania",
    "Thailand",
    "Timor-Leste",
    "Togo",
    "Tokelau",
    "Tonga",
    "Trinidad & Tobago",
    "Tunisia",
    "Turkmenistan",
    "Turks & Caicos Islands",
    "Tuvalu",
    "Türkiye",
    "U.S. Outlying Islands",
    "U.S. Virgin Islands",
    "Uganda",
    "Ukraine",
    "United Arab Emirates",
    "United Kingdom",
    "United States",
    "Uruguay",
    "Uzbekistan",
    "Vanuatu",
    "Vatican City",
    "Venezuela",
    "Vietnam",
    "Wallis & Futuna",
    "Western Sahara",
    "Yemen",
    "Zambia",
    "Zimbabwe",
    "Åland Islands",
    "Other / not listed",
    "Prefer not to say"
  ]
};

/**
 * Job Search Pulse — Google Apps Script builder.
 * Run createJobSearchSurvey() in a NEW project at https://script.google.com/.
 * Creates one unpublished Google Form, a private response Sheet, and a Data dictionary tab.
 * No emails, network fetches, public Sheet sharing, or time-based triggers.
 * Uses script properties to avoid duplicate creation when rerun after success.
 */
function createJobSearchSurvey() {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const props = PropertiesService.getScriptProperties();
    const prior = props.getProperty('JOB_SEARCH_FORM_ID');
    if (prior) {
      const existing = FormApp.openById(prior);
      console.log('Existing form: ' + existing.getEditUrl());
      console.log('Build state: ' + props.getProperty('JOB_SEARCH_BUILD_STATE'));
      console.log('This rerun did not add items or overwrite existing responses.');
      return existing.getEditUrl();
    }
    const form = FormApp.create(SURVEY.title, false);
    props.setProperties({JOB_SEARCH_FORM_ID:form.getId(), JOB_SEARCH_BUILD_STATE:'building'});
    form.setDescription(SURVEY.description)
      .setCollectEmail(false).setLimitOneResponsePerUser(false)
      .setPublishingSummary(false).setShowLinkToRespondAgain(false)
      .setShuffleQuestions(false).setProgressBar(false)
      .setConfirmationMessage('Thank you. If you chose to participate, your response will help describe applicants\' experiences. Please submit only once for this survey round.');
    const pages = {};
    const records = [];
    const branches = [];
    const locationPages = [];
    let countryItem;
    function addQuestion(q, section) {
      let item;
      switch (q.type) {
        case 'choice': item = form.addMultipleChoiceItem(); break;
        case 'checkbox': item = form.addCheckboxItem(); break;
        case 'dropdown': case 'country': item = form.addListItem(); break;
        case 'paragraph': item = form.addParagraphTextItem(); break;
        default: item = form.addTextItem();
      }
      item.setTitle(q.title).setRequired(!!q.required);
      if(q.help) item.setHelpText(q.help);
      if(q.options) item.setChoiceValues(q.options);
      if(q.maxChoices) item.setValidation(FormApp.createCheckboxValidation().requireSelectAtMost(q.maxChoices).build());
      if(q.routes) branches.push({item:item, question:q});
      if(q.type === 'country') countryItem = item;
      records.push([q.id, String(item.getId()), section, q.type, q.title, q.required ? 'required':'optional', JSON.stringify(q.options || [])]);
    }
    SURVEY.sections.forEach(function(section, index) {
      if(index > 0) pages[section.id] = form.addPageBreakItem().setTitle(section.title);
      else form.addSectionHeaderItem().setTitle(section.title);
      if(section.help && pages[section.id]) pages[section.id].setHelpText(section.help);
      section.questions.forEach(q => addQuestion(q,section.id));
      if(section.id === 'profile') {
        Object.keys(SURVEY.locations).forEach(function(country, i) {
          const cfg = SURVEY.locations[country];
          const id = 'location_' + i;
          pages[id] = form.addPageBreakItem().setTitle('Your location — ' + country);
          locationPages.push({country:country, page:pages[id]});
          addQuestion({id:id,type:'dropdown',title:cfg.label+' — '+country+' (Optional)',options:cfg.options,required:false},id);
        });
        pages.location_other = form.addPageBreakItem().setTitle('Your location');
        locationPages.push({country:null,page:pages.location_other});
        addQuestion({id:'country_other',type:'text',title:'If your country or territory was not listed, enter it here (Optional)',required:false},'location_other');
        addQuestion({id:'region_other',type:'text',title:'Which state, province or region do you live in? (Optional)',help:'Use the appropriate administrative region for the country you selected. Leave blank if not applicable or if you prefer not to say. Do not enter your address or postcode.',required:false},'location_other');
      }
    });
    // A PageBreakItem's setGoToPage controls the section BEFORE that break.
    // Route each country-specific page to the common search page, skipping other countries.
    for(let i=0; i<locationPages.length; i++) {
      const nextBreak = i+1 < locationPages.length ? locationPages[i+1].page : pages.search;
      nextBreak.setGoToPage(pages.search);
    }
    countryItem.setChoices(SURVEY.countries.map(function(country) {
      const match = locationPages.find(x => x.country === country);
      const destination = country === 'Prefer not to say' ? pages.search : (match ? match.page : pages.location_other);
      return countryItem.createChoice(country,destination);
    }));
    branches.forEach(function(b) {
      b.item.setChoices(b.question.options.map(function(label,i) {
        const route = b.question.routes[i];
        return b.item.createChoice(label,route === 'SUBMIT' ? FormApp.PageNavigationType.SUBMIT : pages[route]);
      }));
    });
    const sheet = SpreadsheetApp.create('Job Search Pulse — Responses');
    props.setProperty('JOB_SEARCH_SHEET_ID',sheet.getId());
    form.setDestination(FormApp.DestinationType.SPREADSHEET,sheet.getId());
    const dictionary = sheet.insertSheet('Data dictionary');
    dictionary.getRange(1,1,records.length+1,7).setValues([['field_id','form_item_id','section','type','question','required','options_json']].concat(records));
    dictionary.setFrozenRows(1);
    dictionary.getRange(1,1,1,7).setFontWeight('bold');
    dictionary.autoResizeColumns(1,4);
    dictionary.setColumnWidth(5,450);
    dictionary.setColumnWidth(7,450);
    props.setProperty('JOB_SEARCH_BUILD_STATE','complete');
    console.log('EDIT / REVIEW: '+form.getEditUrl());
    console.log('RESPONSE SHEET: '+sheet.getUrl());
    console.log('RESPONDER URL (usable after publishing): '+form.getPublishedUrl());
    console.log('Review the form, publish it for anyone with the link, and test in a signed-out browser before posting.');
    return form.getEditUrl();
  } finally {
    lock.releaseLock();
  }
}
