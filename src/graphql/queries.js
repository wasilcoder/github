import { gql } from "@apollo/client";

export const GET_NAME = gql`
  query {
    account {
      name
    }
  }
`;

export const GET_PROFILE = gql`
  query {
    account {
      name
      phone
      industry
    }
  }
`;

export const GET_JOBS_AFTER_DATE = gql`
  query JOBS_WRAP($cursor: String, $limit: Int!, $Date: ISO8601DateTime!) {
    jobs(
      after: $cursor
      first: $limit
      filter: { createdAt: { after: $Date } }
    ) {
      pageInfo {
        endCursor
        hasNextPage
      }
      nodes {
        id
        createdAt
        client {
          id
          createdAt
          isLead
        }
      }
    }
  }
`;

export const GET_TIMESHEET_AFTER_DATE = gql`
  query TIMESHEET_WRAP($cursor: String, $Date: ISO8601DateTime!) {
    timeSheetEntries(
      after: $cursor
      filter: { createdAt: { after: $Date } }
    ) {
      pageInfo {
        endCursor
        hasNextPage
      }
      nodes {
        id
        approved
        createdAt
        visitDurationTotal
      }
    }
  }
`;
