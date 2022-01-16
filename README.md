# quizapp
The challenge is to create a small API for a quiz app where users can create and attempt quizzes. The users should also be able to see some basic stats about their quiz attempts.


Limitations:
1. Soft Delete was not implemented.
2. Pagination was not fully implemented.
3. jsonwebtoken is outdated and was last published 3 years ago.
4. JWT logout is not the best implementation and might be open to hackers.
4. All POST request can only handle 1 record at a time for now.
5. Error message is not optimal and can be way better than what is currrently implemented.

TODO:
1. Categorize the quiz i.e { Sports, History, Politics, Art, War, Movies, General Knowledge}
2. Set the difficulty level of each quiz i.e {Easy, Medium, Hard}
3. Set the Type of the quiz i.e {Multiple Choice, True / False }


TESTING:
1. From the command line run the following command to run the test
node -r @adonisjs/assembler/build/register japaFile.ts or npm run test.
2. You can also configure a separate database for testing by creating .env.testing file in the project root and overwriting the necessary environment variables.

Bugs:
1. Quiz updating