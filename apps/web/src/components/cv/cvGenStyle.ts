import { StyleSheet } from '@react-pdf/renderer';

export const styles = StyleSheet.create({
  page: {
    backgroundColor: '#fff',
    color: '$262626',
    fontFamily: 'Helvetica',
    fontSize: 12,
    padding: '30px 50px',
  },
  profile: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 12,
    margin: '5px 0px 0px 0px',
  },
  textBold: {
    fontFamily: 'Helvetica-Bold',
  },
  card: {
    border: '1px solid black',
    padding: 2,
    margin: '2px 0px',
  },
  cardTitle: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
  },
  cardFlexRow: {
    display: 'flex',
    flexDirection: 'row',
    gap: '2px',
  },
});
