import { Fragment } from "react";

import Head from "next/head";

import MeetupList from "../components/meetups/MeetupList";
import { MongoClient } from "mongodb";

const HomePage = (props) => {
  return (
    <Fragment>
      <Head>
        <title>React Meetups</title>
        <meta
          name="description"
          content="Browse a huge list of highly active React meetups!"
        />
      </Head>
      <MeetupList meetups={props.meetups} />
    </Fragment>
  );
};

// export async function getServerSideProps(context) {

//   return {
//     props: {
//       meetups: DUMMY_MEETUPS,
//     },
//   };
// }

export async function getStaticProps() {
  const client = await MongoClient.connect(
    "mongodb+srv://karpenkoihor96:pWfWehXRay99Qwza@practice-project.gqqkcsn.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const meetups = await meetupsCollection.find().toArray();

  client.close();
  return {
    props: {
      meetups: meetups.map(({ title, image, address, description, _id }) => ({
        title,
        image,
        address,
        description,
        id: _id.toString(),
      })),
    },
    revalidate: 1,
  };
}

export default HomePage;
