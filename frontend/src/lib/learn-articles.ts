export type LearnArticle = {
  title: string
  slug: string
  category: string
  readTime: string
  excerpt: string
  sections: Array<{
    heading?: string
    paragraphs?: string[]
    list?: string[]
  }>
}

export const learnArticles: LearnArticle[] = [
  {
    title: 'Building a House in Zimbabwe: A Practical Step-by-Step Guide',
    slug: 'building-house-zimbabwe-step-by-step',
    category: 'Building Process',
    readTime: '16 min',
    excerpt:
      'A practical journey from land confirmation to design, approvals, contractor selection, construction, inspections, services, and move-in.',
    sections: [
      {
        paragraphs: [
          'This guide explains the typical process of building a house in Zimbabwe after you already own land. It also highlights where different professionals fit in, which is where your platform adds value.',
        ],
      },
      {
        heading: 'Stage 1: Land and Legal Confirmation',
        paragraphs: [
          'Even if you already own land, this step is critical to avoid disputes, delays, or financial losses later in the process.',
          'Confirm your ownership documents, such as a title deed, offer letter, or 99-year lease. Verify zoning details, including residential use, density, and the correct local authority jurisdiction.',
          'Check for servitudes on the land, including road access requirements, sewer line routes, electricity lines or pylons, and drainage pathways.',
          'Zimbabwe 2026 practical note: always confirm that your title deed complies with the validation and digitisation requirements introduced under SI 76 of 2025. Some properties may appear valid but may still be undergoing verification.',
        ],
        list: [
          'Real estate agents can help interpret ownership documents and land use conditions.',
          'Town planners can advise on zoning, building lines, and allowable structures.',
          'Conveyancers or property consultants can confirm legal ownership status.',
        ],
      },
      {
        heading: 'Stage 2: Budgeting and Build Strategy',
        paragraphs: [
          'At this stage, you decide what type of house you can realistically afford before starting designs or construction.',
          'Define the size of the house, the number of bedrooms and bathrooms, and whether the structure will be single-storey or double-storey.',
          'Your budget should include construction costs, professional fees, council fees, utilities, security, and a contingency allowance of at least 10% to 15%.',
          'Zimbabwe 2026 practical note: prices change frequently due to exchange rates and fuel costs. Materials can increase in price during construction, and skilled labour costs have also increased.',
        ],
        list: [
          'Quantity surveyors prepare cost estimates and Bills of Quantities.',
          'Contractors provide rough building cost ranges.',
          'Architects align your design with your budget.',
        ],
      },
      {
        heading: 'Stage 3: Design and Technical Drawings',
        paragraphs: [
          'Your ideas are turned into formal plans required for council approval.',
          'You will need architectural drawings, structural drawings, a site plan, and a drainage plan.',
          'Councils will not approve verbal ideas. Approved drawings are mandatory before construction.',
        ],
        list: ['Architects or building designers', 'Structural engineers', 'Civil engineers for drainage and sewer systems'],
      },
      {
        heading: 'Stage 4: Council Plan Approvals',
        paragraphs: [
          'Your building plans are submitted to the local authority for approval. Typical councils include City of Harare, Bulawayo City Council, Chitungwiza Municipality, Ruwa Town Council, and Rural District Councils.',
          'You submit building plans, pay plan submission fees, respond to requested corrections, and receive stamped approved plans.',
          'Zimbabwe 2026 practical note: councils are stricter on compliance. EMA may be required if the land is in a sensitive area such as wetlands. Building without approval can result in fines, stop orders, or demolition.',
        ],
        list: ['Architects or town planners can handle submissions.', 'Building consultants can advise on compliance issues.'],
      },
      {
        heading: 'Stage 5: Contractor Selection and Contracting',
        paragraphs: [
          'You select the person or company that will build your house.',
          'Compare experience with similar projects, project timelines, labour-only versus full-service options, references, and previous work.',
          'Agree on the scope of work, payment schedule linked to milestones, responsibilities for materials and labour, and completion timelines.',
          'Always sign a written contract before work begins.',
        ],
        list: ['Building contractors', 'Construction managers', 'Independent inspectors'],
      },
      {
        heading: 'Stage 6: Site Preparation',
        paragraphs: [
          'The land is prepared for construction through clearing vegetation, pegging the building area, excavating the foundation area, and arranging temporary water supply.',
          'Zimbabwe 2026 practical note: some sites may require levelling or additional filling. Water access is critical early in construction.',
        ],
        list: ['Surveyors help with pegging and boundaries.', 'Contractors handle clearing and excavation.'],
      },
      {
        heading: 'Stage 7: Construction Phase',
        paragraphs: [
          'The main construction stages are foundations, brickwork, roofing, plumbing installation, electrical installation, plastering and rendering, flooring, ceilings, and finishes.',
          'Monitor progress regularly, ensure payments match completed work, and keep records of changes or variations.',
          'Zimbabwe 2026 practical note: material shortages can delay projects, skilled labour must be booked early, and regular site visits are important.',
        ],
        list: ['Building contractors', 'Plumbers', 'Electricians', 'Carpenters', 'Tilers'],
      },
      {
        heading: 'Stage 8: Inspections and Completion',
        paragraphs: [
          'The building is checked before final handover. Inspect quality of work, prepare a snag list, and ensure all corrections are completed.',
          'You may also need to apply for an occupation or completion certificate where required by council.',
        ],
        list: ['Building inspectors', 'Architects or engineers', 'Council liaison professionals'],
      },
      {
        heading: 'Stage 9: Services Connection and Move-In',
        paragraphs: [
          'Final steps include connecting electricity, connecting water, installing security systems, and moving into the property.',
          'Zimbabwe 2026 practical note: many homeowners install solar systems due to unreliable grid supply. Boreholes are common where municipal water is inconsistent.',
        ],
        list: ['Electricians', 'Solar installers', 'Borehole drilling companies', 'Security contractors'],
      },
      {
        heading: 'Simple Journey Summary',
        paragraphs: ['The typical process follows this sequence: land, design, approval, contractor, build, inspect, move in.'],
      },
    ],
  },
  {
    title: 'First-Time Buyer Guide and Property Learning Notes: Zimbabwe, 2026',
    slug: 'first-time-buyer-guide-zimbabwe-2026',
    category: 'Getting Started',
    readTime: '18 min',
    excerpt:
      'A practical guide for new buyers covering property types, costs, ownership checks, compliance, building, budgets, services, and diaspora buying.',
    sections: [
      {
        heading: 'Introduction',
        paragraphs: [
          'Buying property in Zimbabwe can feel overwhelming if you have never done it before. This guide is designed to take you from having little or no knowledge to understanding exactly what to do and what to look out for.',
          'Property is a major financial commitment, and making the wrong decision can lead to serious financial loss. With the right knowledge and proper checks, you can buy safely and confidently.',
        ],
      },
      {
        heading: 'Step 1: Understand Property Types',
        paragraphs: [
          'Before anything else, you must understand what you are buying.',
          'Land, also called a stand, is empty land where you will build your house. Serviced stands already have roads, sewer systems, and water connections installed, so you can start building sooner. Unserviced land has no infrastructure yet, and development may take years before you can build.',
          'A house is already built and ready to occupy. It is suitable if you want immediate accommodation and is usually lower risk compared to land.',
          'Land offers flexibility but comes with more risks, especially around documentation and infrastructure.',
        ],
      },
      {
        heading: 'Step 2: Know the Total Cost',
        paragraphs: [
          'Many first-time buyers only look at the advertised price, which is misleading. A stand advertised for $15,000 does not include all additional costs.',
          'You should expect to pay an additional 5% to 15% on top of the purchase price.',
        ],
        list: ['Legal fees for ownership transfer', 'Administrative and government fees', 'Estate agent commission', 'Rates clearance and outstanding council bills'],
      },
      {
        heading: 'Step 3: Verify Ownership',
        paragraphs: [
          'Zimbabwe introduced major changes to property ownership laws. All title deeds must be validated and digitised, with a 24-month compliance period under SI 76 of 2025.',
          'Some properties may appear legal but may not be fully recognised. Buyers must confirm that title deeds are valid and compliant.',
        ],
        list: ['Ask if the title deed has been validated.', 'Confirm the seller name matches the deed.', 'Verify documents through a lawyer.'],
      },
      {
        heading: 'Step 4: Understand Property Documents',
        paragraphs: [
          'You will come across several important documents. Understanding them is critical to avoiding fraud and legal disputes.',
        ],
        list: [
          'Title deed: the official proof of ownership and subject to new validation requirements.',
          'Agreement of sale: the legal contract between buyer and seller.',
          'Rates clearance certificate: confirms council bills are paid and is required before transfer.',
          'Cession agreement: used where there is no title deed yet and provides limited ownership rights.',
        ],
      },
      {
        heading: 'Step 5: Conduct Due Diligence',
        paragraphs: ['Before committing to any property, do the checks that confirm both legal ownership and practical usability.'],
        list: ['Conduct a deeds search.', 'Confirm council records.', 'Check zoning restrictions.', 'Inspect the property physically.', 'Verify development approvals.'],
      },
      {
        heading: 'Step 6: Avoid Common Mistakes',
        paragraphs: ['Many buyers lose money due to simple mistakes. Slow down, verify, and keep records.'],
        list: ['Do not buy land without council verification.', 'Do not pay deposits without a written agreement.', 'Do not rely on verbal agreements.', 'Do not rush into a deal.'],
      },
      {
        heading: 'Step 7: Engage Professionals',
        paragraphs: ['Always involve qualified professionals who can help protect your investment.'],
        list: ['Registered estate agent', 'Conveyancing lawyer', 'Surveyor, if necessary'],
      },
      {
        heading: 'Final Advice',
        paragraphs: [
          'If you remember only one thing: always verify ownership before making any payment.',
          'This article is intended as a practical guide for Zimbabwean property market participants in 2026 and should be supplemented with professional legal, financial, and technical advice where required.',
        ],
      },
      {
        heading: 'How Much Does It Cost to Build in Zimbabwe?',
        paragraphs: [
          'Building costs in Zimbabwe change frequently due to economic conditions, material prices, and exchange rate movements.',
          'Typical 2026 construction cost ranges are about $80 to $200 per square metre for basic construction, $450 to $550 per square metre for standard construction, and $700+ per square metre for high-end construction.',
          'A standard 3-bedroom house may cost approximately $50,000 to $70,000 or more.',
        ],
        list: [
          'Materials can account for 45% to 60% of the budget.',
          'Labour can account for 20% to 30%.',
          'Fees and approvals can account for 8% to 12%.',
          'Contingency should usually be 10% to 15%, and in practice 15% to 20% is safer.',
          'Additional costs may include borehole drilling, solar installation, boundary walls, security, and EMA approvals.',
        ],
      },
      {
        heading: 'Land vs House: Which Should You Buy?',
        paragraphs: [
          'Buying land is usually cheaper upfront and gives flexible design options with potential long-term appreciation. The challenges are development time, documentation risks, and infrastructure delays.',
          'Buying a house gives immediate occupation, lower legal risk, and potential rental income. The challenges are higher cost and limited design flexibility.',
          'As a simple decision guide, beginners are generally safer buying a house, while experienced buyers may prefer land for flexibility and potential gains.',
        ],
      },
      {
        heading: 'Understanding Property Documents',
        paragraphs: [
          'Property documents determine whether you legally own the property. Key documents include title deeds, agreements of sale, rates clearance certificates, cession documents, and approved building plans.',
          'Red flags include missing documents, sellers rushing the deal, and incomplete paperwork.',
        ],
      },
      {
        heading: 'Legal and Compliance',
        paragraphs: [
          'Title deeds are proof of ownership and are managed by the Deeds Registry. Under 2026 updates, validation and digitisation introduced under SI 76 of 2025 are mandatory.',
          'Risks of non-compliance can include inability to sell property, legal disputes, and loss of transaction rights.',
          'Council cession transfers rights but not full ownership. It is common in new developments but may create risks such as no bank financing and delays in title issuance.',
        ],
      },
      {
        heading: 'EMA Clearance Process',
        paragraphs: [
          'Environmental approval is required for developments that may impact the environment, especially housing projects in sensitive areas such as wetlands.',
          'You may need EMA clearance for housing developments, clusters, new stands, construction in wetlands or near water bodies, large infrastructure, or commercial developments.',
          'Start by visiting or contacting your nearest Environmental Management Agency office. You may be asked for a copy of title deed or proof of ownership, national ID or company registration documents, property location details, and a basic description of the project.',
          'EMA will determine whether you need a full Environmental Impact Assessment or a simpler approval process. If a full EIA is required, you must hire a registered environmental consultant.',
          'A project prospectus usually includes a project description, location map, current environmental condition of the site, expected environmental impact, mitigation measures, and estimated project value.',
          'The consultant may conduct stakeholder consultation with the local authority, district administrator, ZINWA, Forestry Commission, and local community representatives.',
          'If approved, you receive an EIA Certificate that legally allows you to proceed with construction. The certificate is generally valid for 2 years.',
        ],
        list: [
          'Do not begin construction without approval where EMA approval is required.',
          'Building on wetlands is strictly controlled and often restricted.',
          'Starting without EMA approval can result in fines, project stoppage, and legal penalties.',
        ],
      },
      {
        heading: 'Rates and Taxes',
        paragraphs: [
          'Property owners in Zimbabwe must pay municipal charges before property can be legally transferred. These can include council rates, water charges, refuse collection fees, and other municipal levies.',
          'A Rates Clearance Certificate confirms that all bills are fully paid and that the property can be legally transferred. Without it, the Deeds Office will not process transfer.',
          'Start by identifying the correct local authority, then visit the Rates Department and request a statement of account and rates clearance for property transfer.',
          'You may need the property address, stand number, owner name, account number, copy of title deed, and ID document. After settling outstanding amounts, submit proof of payment and apply for the clearance certificate.',
          'Some transactions may also require a ZIMRA Tax Clearance Certificate, also known as ITF263.',
        ],
      },
      {
        heading: 'Building Process',
        paragraphs: [
          'A typical building timeline includes planning, design, budgeting, approvals, foundation, structure, and finishing. Many residential projects take around 6 to 12 months.',
          'When choosing an architect, look for registration, experience, a strong portfolio, and understanding of the local approval environment.',
          'Common materials include cement, bricks, steel, and roofing, but prices may fluctuate frequently.',
          'Foundation types vary by site conditions. Strip foundations are common for normal soil, raft foundations may suit weaker soil, and pile foundations may be needed in wetlands or difficult ground.',
        ],
      },
      {
        heading: 'Budget and Finance',
        paragraphs: [
          'A practical building budget should include land, materials, labour, fees, utilities, and contingency.',
          'To avoid cost overruns, plan in detail, track spending, and avoid unnecessary design changes once construction has started.',
          'Contractor payments should usually be made in stages linked to milestones. Avoid full upfront payments.',
          'When getting quotes, compare materials, labour, timelines, and quality rather than choosing only the cheapest price.',
        ],
      },
      {
        heading: 'Services and Utilities',
        paragraphs: [
          'ZESA supply can be unreliable, while solar is expensive upfront but reliable. A hybrid system using solar plus grid power is often the best option.',
          'Borehole drilling may cost around $2,500 to $5,000 or more and usually involves site assessment, drilling, pump installation, and connection to the plumbing system.',
          'Plumbing systems include water supply, storage tanks, and drainage systems. Sewer is common in serviced urban areas, while septic tanks are used where sewer infrastructure is unavailable.',
        ],
      },
      {
        heading: 'Diaspora Buyers',
        paragraphs: [
          'Building from abroad carries risks such as fraud and poor project supervision. Practical safeguards include hiring a project manager, using contracts, verifying documentation, and keeping records.',
          'When finding contractors, check references, review past work, and be cautious of unusually cheap contracts.',
          'Remote project management should include weekly updates, site inspections, progress tracking, and clear payment records.',
          'For money transfers, use bank transfers or regulated services and avoid cash payments without records.',
        ],
      },
      {
        heading: '2026 Regulatory Notes',
        paragraphs: [
          'A key development is title deed validation and digitisation under SI 76 of 2025. This affects property transactions, ownership verification, and legal compliance.',
          'Always confirm current requirements with the Deeds Registry, local councils, and EMA where relevant.',
        ],
      },
    ],
  },
]

export const getLearnArticle = (slug: string) => learnArticles.find((article) => article.slug === slug)
