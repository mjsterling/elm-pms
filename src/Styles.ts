import { StyleSheet } from 'react-native';

export const Styles = StyleSheet.create({
  FRCC: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  FCBC: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  FCSC: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
  },
  FCSS: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '100%',
  },
  FCCC: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  FRSC: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
  },
  FRCS: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: '100%',
  },
  FRBC: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  FREC: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
  },
  FRBS: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
  },
  viewWrapper: {
    flex: 1,
    padding: 10,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  footerText: {
    fontSize: 16,
    textAlign: 'center',
  },
  header: {
    height: '10%',
  },
  body: {
    height: '80%',
  },
  footer: {
    height: '10%',
  },
  addToDoButton: {
    backgroundColor: '#00BAD4',
    width: 150,
    borderRadius: 4,
    margin: 5,
  },
  taskTitle: {
    minWidth: 275,
  },
  modalContainer: {
    height: '80%',
    width: '90%',
    left: '5%',
    top: '10%',
    borderColor: 'black',
  },
  modalTitle: {
    fontSize: 16,
    width: '100%',
    paddingVertical: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textInput: {
    marginBottom: 10,
    width: '100%',
  },
  textInputHalf: {
    marginBottom: 10,
    width: '48%',
  },
});
