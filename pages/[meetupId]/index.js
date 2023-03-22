import { Fragment } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import MeetupDetail from "../../components/meetups/MeetupDetail";
import { MongoClient, ObjectId } from "mongodb";

const MeetupDetails = (props) => {
  const router = useRouter();

  if (router.isFallback) {
    <h1>Data is loading</h1>;
  }

  return (
    <Fragment>
      <Head>
        <title>{props.meetupData.title}</title>
        <meta name="description" content={props.meetupData.description} />
      </Head>
      <MeetupDetail
        image={props.meetupData.image}
        title={props.meetupData.title}
        address={props.meetupData.address}
        description={props.meetupData.description}
      />
    </Fragment>
  );
};

export async function getStaticPaths(context) {
  const client = await MongoClient.connect(
    "mongodb+srv://karpenkoihor96:pWfWehXRay99Qwza@practice-project.gqqkcsn.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();

  client.close();

  return {
    fallback: true,
    paths: meetups.map((meetup) => ({
      params: {
        meetupId: meetup._id.toString(),
      },
    })),
    fallback: false,
  };
}

export async function getStaticProps(context) {
  const meetupId = context.params.meetupId;

  const client = await MongoClient.connect(
    "mongodb+srv://karpenkoihor96:pWfWehXRay99Qwza@practice-project.gqqkcsn.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const selectedMeetup = await meetupsCollection.findOne({
    _id: new ObjectId(meetupId),
  });

  client.close();

  return {
    props: {
      meetupData: {
        id: selectedMeetup._id.toHexString(),
        title: selectedMeetup.title,
        image: selectedMeetup.image,
        description: selectedMeetup.description,
        address: selectedMeetup.address,
      },
    },
  };
}

export default MeetupDetails;
