/**
 * Powered by Systango
 * http://www.systango.com
 */


import React, { Component } from 'react';
import {
  Platform, Dimensions, Image, View, ListView, Text, TextInput, FlatList
} from 'react-native';
import { Button, SQLiteManager } from 'react-native-crashalert';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as authActions from '../../actions/user';
import * as fetchRoute from '../../actions/route';
import styles from './styles';

let ds;
let playerArray = [];

class Search extends Component {
  /*
  * Home - Lifecycle
  */
  constructor(props) {
    super(props);

    //* > Setup state
    this.initialStateSetup();

    //* > Get error data
    const obj = new SQLiteManager();
    obj.getDeviceInfo((crashReport) => {
      playerArray = crashReport;
      this.setState({ dataSource: ds.cloneWithRows(playerArray) });
    });

    this.state = ({
      data: ['Aman', 'Abhishek', 'Kapil', 'Shahid', 'Rahul', 'Rituraj', 'Raj', 'Anurag'],
      searchedData: [],
      text: '',
      isSearchPressed: false,
    });
  }

  searchFilterFunction(text) {
    this.setState({ isSearchPressed: true });
    const newData = this.state.data.filter((item) => {
      const itemData = item.toLowerCase();
      return itemData.toString().indexOf(text.toLowerCase()) > -1;
    });

    this.setState({ searchedData: newData, text });
  }

  _renderItem(item) {
    if (typeof item !== 'undefined') {
      return (
        <View style={{
          justifyContent: 'center', alignItems: 'center', backgroundColor: 'grey', marginBottom: 10, marginHorizontal: 10,
        }}
        >
          <Text style={{ color: 'white', fontSize: 20, padding: 12, }}>{item}</Text>
        </View>
      );
    } else {
      return (
        <View style={{
          justifyContent: 'center', alignItems: 'center', marginBottom: 10, marginHorizontal: 10,
        }}
        >
          <Text style={{ color: 'black', fontSize: 20, padding: 12, }}>No Data Found!</Text>
        </View>
      );
    }
  }

  render() {
    return (
      <View style={[styles.container, { width: this.state.width, height: this.state.height }]}>
        <Image
          source={require('../../../assets/home/navigationBG.png')}
          style={{
            position: 'absolute', left: 0, top: 0, width: this.state.width
          }}
        />

        <View style={{
          flexDirection: 'row', height: (Platform.OS === 'android') ? 50 : 64, alignItems: 'center', paddingTop: 5, backgroundColor: 'green'
        }}
        >
          {this.backButtonView()}
          <View style={{
            flex: 1, marginRight: 50, flexDirection: 'row', justifyContent: 'center', paddingTop: 5, alignItems: 'center', height: (Platform.OS === 'android') ? 50 : 64
          }}
          >
            <Text style={{ color: '#fff', backgroundColor: 'transparent' }}>Search</Text>
          </View>
        </View>
        <View style={styles.textInputContainer}>
          <TextInput
            style={styles.TextInputStyleClass}
            onChangeText={text => this.setState({ text, searchedData: '', isSearchPressed: false })}
            value={this.state.text}
            underlineColorAndroid="transparent"
            placeholder="Search Here"
          />
          <Button style={[styles.btn]} onPress={() => this.searchFilterFunction(this.state.text)} searchText={this.state.text}>
                  Search
          </Button>
        </View>
        <FlatList
          data={(!this.state.isSearchPressed) ? this.state.data : this.state.searchedData}
          extraData={this.state}
          renderItem={rowData => this._renderItem(rowData.item)}
        />
      </View>
    );
  }

  /*
   * List - Private Method
   */
  initialStateSetup() {
    ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 != r2
    });
    this.state = {
      dataSource: ds.cloneWithRows(playerArray),
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height
    };
  }

  pressRowItem(rowData) {
    const abcData = rowData;
    this.props.actions.crashData(abcData);
    this.props.navigation.push('CrashDetail');
  }

  backButtonView() {
    return (
      <Button
        isBorder={false}
        transparent
        onPress={() => this.handleBackPress()}
        style={{
          marginLeft: 10, width: 50, alignItems: 'center', justifyContent: 'center', height: (Platform.OS === 'android') ? 50 : 64
        }}
      >
        <Image source={require('../../../assets/home/arrow.png')} ref="Back Button" />
      </Button>
    );
  }

  handleBackPress() {
    this.props.navigation.pop();
  }
}

function mapStateToProps(state) {
  return {
    userData: state.user.response,
  };
}

function bindActions(dispatch) {
  return {
    route: bindActionCreators(fetchRoute, dispatch),
    actions: bindActionCreators(authActions, dispatch),
  };
}

export default connect(mapStateToProps, bindActions)(Search);
