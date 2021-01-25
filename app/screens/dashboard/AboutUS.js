import React from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'
import { connect } from 'react-redux'
import Header from '../../components/Header'
import colors from '../../constants/colors'
import { getAboutUS, rootLoader } from '../../actions'
import { WebView } from 'react-native-webview'

class AboutUS extends React.Component {
  constructor () {
    super()

    this.state = {
      htmlData: ''
    }
  }

  async componentDidMount () {
    this.props.rootLoader(true)
    const res = await getAboutUS()
    this.props.rootLoader(false)
    if (res.status) {
      this.setState({ htmlData: res.data?.description })
    }
  }

  render () {
    const { htmlData } = this.state
    return (
      <View style={styles.root}>
        <Header
          title='About us'
        />
        <View style={styles.container}>

          <ScrollView
            contentContainerStyle={{ flexGrow: 1, padding: 20 }}
          >
            <WebView
              originWhitelist={['*']}
              source={{ html: htmlData }}
              scalesPageToFit={false}
            />
          </ScrollView>

        </View>

      </View>
    )
  }
}

export default connect(null, {
  rootLoader
})(AboutUS)

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    overflow: 'hidden'
  }
})
