# quizapp

## Basics
The challenge is to create a small API for a quiz app where users can create and attempt quizzes. The users should also be able to see some basic stats about their quiz attempts.

## Acceptance criteria
  - Users can create an account
  - Users can create their own quiz with multiple questions & answers.
  - Users cannot manipulate other users' quiz templates.
  - Users can attempt other users' published quizzes as many times as they choose.
  - Users can view basic stats on quiz attempts/completion/scores/etc..
  - Quizzes must contain at least 1 question and should support varying numbers of questions.
  - Questions must have a non-empty question and a non-empty answer
  - Each submitted quiz should have it's questions marked correct or incorrect based on the predefined answers.

## Limitations:
1. Soft Delete was not implemented.
2. Pagination was not fully implemented.
3. jsonwebtoken might be outdated. (Not really used it for a while)
4. JWT logout is not the best implementation and might be open to hackers.
5. All POST request can only handle 1 record at a time for now.
6. Error message is not optimal and can be way better than what is currrently implemented.

## TODO:
1. Categorize the quiz i.e { Sports, History, Politics, Art, War, Movies, General Knowledge}
2. Set the difficulty level of each quiz i.e {Easy, Medium, Hard}
3. Set the Type of the quiz i.e {Multiple Choice, True / False }
4. Auto Populate the database content from free online quiz api's

## TESTING:
1. From the command line run the following command to run the test `npm run test`.
2. From the command line run `npm run coverage` to view the code coverage.
3. You can also configure a separate database for testing by creating .env.testing file in the project root and overwriting the necessary environment variables. Needed environment variables can be found in env.ts.

## Bugs:
1. Quiz updating has a bug which I am unable to fix due to time constraint.
