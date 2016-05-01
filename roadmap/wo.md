# Work requests

## Visual components

- views/Request/*

-- Pages

--- RequestsPageIndex
--- RequestsPageSingle

-- Partials

--- WODetail
--- WOTableRow

-- Components

--- WOActionButtons (dependant on workflow specified in Request controller - so perhaps the two could be coupled somehow?, maybe Request controller can be split into some subfunctions, basic crud, notifications, workflow)

--- WOFacilitySelector
--- WOPrioritySelector

## Related packages

- models/RequestSchema.jsx
- controllers/Requests.jsx
- controllers/RequestQueries.jsx (used by calendar)

## Tasks

- Add button for contractor follow up for all and individual WOs (see attached)
- Follow up work order should contain history of previous work order in discussion
- Change scheduled priority icon in dd to disc rather than filled in circle
- Should be an additional action available to send message after assignee chosen - "Assign work?"

- WO:Flag duplicates by looking at previous wos

### Feature: MD conformity

- Modal dialogues for new WOs
- MD Compliant WOs

- WO Layout changes:
- Active contractor should link to their supplier card (as should service type in settings once we set that up), 
- Include work request type, eg preventative maintenance, ad-hoc, base building, warranty, contract, no-cost - these can be top level service types
- Button to request contractor update for individual open requests and all
- Constrain wo title to a certain character count to prevent overflow

### Feature: Request responsive layout
- Small: some column headers truncated
- Create xxs < 340px layout (6)
- Small: Facilities services item title fields don't wrap text next to toggle, only under it
- Small: tabs are squashed together causing a misalignment of columns and the underline (see attached)
- Identify facility in H1 header next to Work requests title, then with 'all properties' selected include the facilities in the table (one facility it should be hidden)
- Small: Fit building overview to fit two or even three columns
- Small/med: WO - reconfigure top information section so that it is nicely spaced in say three columns and not clumped together, avatar, priority and status to go on left as per large view
- Small: Facilities - would be good to add two columns in the property details

- Align facility names further left and add them to the title eg Work orders - Spring Hill
- Line up the WO text elements with each other (see attached)
- Modal dialogue style editing

Enable tab to next action in WO
Make 'add new' floating action button larger, sticky, in bottom left and with a shadow in line with MDL heights

* Action buttons/ workflow

