import React, { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { RouteComponentProps } from 'react-router-dom';
import popoverModelStyles from '../containers/PopOver/popOver.module.scss';
import './App.scss'; // INFO: do not move down, placed on purpose
import Sidebar from '../containers/Sidebar';
import { getRpcConfigsRequest } from '../containers/RpcConfiguration/reducer';
import ErrorModal from '../containers/PopOver/ErrorModal';
import UpdateProgressModal from '../containers/PopOver/UpdateProgress';
import routes from '../routes';
import LaunchScreen from '../components/LaunchScreen';

interface AppProps extends RouteComponentProps {
  isRunning: boolean;
  getRpcConfigsRequest: () => void;
  nodeError: string;
  isFetching: boolean;
  isErrorModalOpen: boolean;
  isUpdateModalOpen: boolean;
}

const getPathDepth = (location: any): number => {
  return (location || {}).pathname.split('/').length;
};

const determineTransition = (location, prevDepth) => {
  const depth = getPathDepth(location) - prevDepth;

  if (depth < 0) {
    return ['transit-pop', 300];
  } else if (depth > 0) {
    return ['transit-push', 300];
  } else {
    return ['transit-fade', 30];
  }
};

const App: React.FunctionComponent<AppProps> = (props: AppProps) => {
  const {
    location,
    getRpcConfigsRequest,
    isRunning,
    isErrorModalOpen,
    isUpdateModalOpen,
    nodeError,
    isFetching,
  } = props;

  const prevDepth = useRef(getPathDepth(location));

  useEffect(() => {
    getRpcConfigsRequest();
  }, []);

  useEffect(() => {
    prevDepth.current = getPathDepth(location);
  });

  const transition = determineTransition(location, prevDepth.current);

  return (
    <>
      {isRunning ? (
        <div
          id='app'
          className={
            isErrorModalOpen || isUpdateModalOpen
              ? popoverModelStyles.openErrorModal
              : ''
          }
        >
          <Helmet>
            <title>DeFi Blockchain Client</title>
          </Helmet>
          <Sidebar />
          <main>
            <TransitionGroup
              className='transition-group'
              childFactory={(child) =>
                React.cloneElement(child, {
                  classNames: transition[0],
                  timeout: transition[1],
                })
              }
            >
              <CSSTransition timeout={300} key={location.key}>
                {routes(location)}
              </CSSTransition>
            </TransitionGroup>
          </main>
          <ErrorModal />
        </div>
      ) : (
        <LaunchScreen message={nodeError} isLoading={isFetching} />
      )}
      <UpdateProgressModal />
    </>
  );
};

const mapStateToProps = ({ app, popover }) => ({
  isRunning: app.isRunning,
  nodeError: app.nodeError,
  isFetching: app.isFetching,
  isErrorModalOpen: popover.isOpen,
  isUpdateModalOpen: popover.isUpdateModalOpen,
});

const mapDispatchToProps = { getRpcConfigsRequest };

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(App));
