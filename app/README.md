# app

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### Things to do
```
security on rooms
    delete after x hours/days/months
    restrict to domain
    restrict to email list
    (can always whitelist/blacklist)
manage members
    whitelist or blacklist
global reactions
    just like reacting on a card; makes a new card
    all entries within 15s delay are put on same card
all cards
    admin removable
    admin pinnable
    reactions
moderator toolbar / widgets
    close meeting
        copy/paste list of AIs and links shared
        option to email them
        kicks off survey for everyone else
    take a timeout: expires in n minutes, users can ack when ready
        modal until closed
        close option
        noise when expires or all ack
    conduct a poll
        textarea, each line is a question
        allow user write-ins
        x of y completed
        number of votes (default 1)
    questions
        unpin, mark resolved, answer, collapse
        can also add a question
user toolbar/widgets
    question: collapsible, answerable, resolvable
    add a link
    react to meeting
    mark me afk (modal until back)
    add an AI
        can be assigned (unassigned go to moderator)
        can be marked completed
        (All AIs automatically emailed to owners at end of meeting, unassigned go to the moderator)
end of meeting survey
    respond anonymously? (if > 1 and < 3 anon, then all responses are anon)
    Meeting was well conducted
    Meeting content was important
    I had a purpose in the meeting
    I felt encouraged and included
    gvcassist made the meeting more interactive
    comments box
```