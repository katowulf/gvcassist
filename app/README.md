# app

## Project setup
```
npm install
```

Rename `firebase-config.template.ts` to `firebase-config.ts`. 
Copy in the *Firebase SDK snippet* from your 
[web app settings](https://console.firebase.google.com/project/_/settings/general)
in the Firebase console.

## Development

### Run a local server with hot-reloads
```
npm run serve
```

For debugging, try opening the js console and entering `enableDebugging(true)` for a mini footer bar with UI and auth info, or browse to `/debug` to see a full page output.

### Lints and fixes files
```
npm run lint
```

### Run test units
To run test units once from npm:
```
npm run test
```

Run test units from your IDE:
```
# Start the emulator for continuous testing
npm run test:emu
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## Deployment

When deploying to staging servers, use `--mode development`; production servers use `--mode production`.

```
npm run build --mode <development|production>
```

## Todo list
```
security on rooms
    ✓ data retention policy
    ✓ restrict to domain
    ✓ restrict to email list
    ✓ add to whitelist
    ✓ add to blacklist
      cannot be in both whitelist and blacklist
global reactions
    just like reacting on a card; makes a new card
    all entries within 15s delay are put on same card
all cards
    admin removable
    admin pinnable
    ✓ reactions
moderator toolbar / widgets
    close meeting
        ✓ closing meeting makes it readonly
        copy/paste list of AIs and links shared
        option to email them
        kicks off survey for everyone else
    take a timeout: expires in n minutes, users can ack when ready
        modal until closed
        close option
        noise when expires or all ack
    create a todo list
        has a title
        anyone can add todos
        assignable as AIs
        emailed after closing meeting
    conduct a poll
        textarea, each line is a question
        allow user write-ins
        x of y completed
        number of votes (default 1)
    questions
        unpin, mark resolved, answer, collapse
        can also add a question
user toolbar/widgets
    ✓ question: collapsible, answerable, resolvable
    ✓ add a link
    ✓ react to meeting
    ✓ mark me afk (modal until back)
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