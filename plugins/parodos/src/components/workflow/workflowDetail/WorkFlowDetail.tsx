import { ParodosPage } from '../../ParodosPage';
import {
  ContentHeader,
  Progress,
  SupportButton,
} from '@backstage/core-components';
import { Box, Chip, makeStyles, Typography } from '@material-ui/core';
import { WorkFlowLogViewer } from './WorkFlowLogViewer';
import React, { useEffect, useState } from 'react';
import { WorkFlowStepper } from './topology/WorkFlowStepper';
import { useLocation, useParams } from 'react-router-dom';
import { mockLog } from './topology/mock/mockLog';
import * as urls from '../../../urls';
import {
  WorkflowStatus,
  workflowStatusSchema,
  WorkflowTask,
  WorkStatus,
} from '../../../models/workflowTaskSchema';
import { useStore } from '../../../stores/workflowStore/workflowStore';
import { fetchApiRef, useApi } from '@backstage/core-plugin-api';
import { Project } from '../../../models/project';

const useStyles = makeStyles(_theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  badge: {
    alignSelf: 'flex-start',
  },
  detailContainer: {
    flex: 1,
    display: 'grid',
    gridTemplateRows: '1fr 1fr',
    minHeight: 0,
  },
  viewerContainer: {
    display: 'grid',
    minHeight: 0,
  },
}));

export const WorkFlowDetail = () => {
  const { projectId, executionId } = useParams();
  const { state } = useLocation();
  const { isNew, initTasks } = state;
  const [selectedTask, setSelectedTask] = useState<string | null>('');
  const [workflowName, setWorkflowName] = useState<string>('');
  const [allTasks, setAllTasks] = useState<WorkflowTask[]>(initTasks);
  const [log, setLog] = useState<string>(``);
  const [countlog, setCountlog] = useState<number>(0);
  const workflowsUrl = useStore(store => store.getApiUrl(urls.Workflows));
  const projects = useStore(store => store.projects);
  const [project, setProject] = useState<Project>();
  const styles = useStyles();
  const { fetch } = useApi(fetchApiRef);

  const getSelectedTaskLog = React.useCallback(
    (templog: string) => {
      // TODO  api call to get a task log from Workflow Execution Id
      if (selectedTask !== '') setLog(templog);
    },
    [selectedTask],
  );

  // get project name
  useEffect(() => {
    const prj = projects.find(p => p.id === projectId);
    if (prj) setProject(prj);
  }, [projectId, projects]);

  // update task state regularly
  useEffect(() => {
    const updateWorks = (works: WorkStatus[]) => {
      let needUpdate = false;
      const tasks = [...allTasks];
      for (const work of works) {
        if (work.type === 'TASK') {
          const foundTask = tasks.find(task => task.id === work.name);
          if (foundTask && foundTask.status !== work.status) {
            foundTask.status = work.status;
            needUpdate = true;
          }
        } else if (work.works) updateWorks(work.works);
      }
      if (needUpdate) setAllTasks(tasks);
    };

    const updateWorksFromApi = async () => {
      const data = await fetch(`${workflowsUrl}/${executionId}/status`);
      const response = workflowStatusSchema.parse(
        (await data.json()) as WorkflowStatus,
      );

      setWorkflowName(response.workFlowName);
      updateWorks(response.works);

      return response.works;
    };

    const taskInterval = setInterval(() => {
      updateWorksFromApi();
    }, 5000);
    updateWorksFromApi();
    return () => clearInterval(taskInterval);
  }, [allTasks, executionId, fetch, workflowsUrl]);

  // update log of selected task regularly
  useEffect(() => {
    getSelectedTaskLog(
      `checking logs for ${selectedTask?.toUpperCase()}:${countlog} in execution: ${executionId}\n${mockLog}`,
    );
    const logInterval = setInterval(() => {
      let test: string = '';
      for (let i = 0; i < countlog; i++) {
        test = `${test}\nmock log line ${i}`;
      }
      getSelectedTaskLog(
        `checking logs for ${selectedTask?.toUpperCase()}:${countlog} in execution: ${executionId}\n${mockLog}${test}`,
      );
      setCountlog(countlog + 1);
    }, 3000);

    return () => clearInterval(logInterval);
  }, [countlog, executionId, getSelectedTaskLog, selectedTask]);

  return (
    <ParodosPage className={styles.container}>
      {isNew && (
        <Chip
          className={styles.badge}
          label="New application"
          color="secondary"
        />
      )}
      <ContentHeader title="Onboarding">
        <SupportButton title="Need help?">Lorem Ipsum</SupportButton>
      </ContentHeader>
      <Typography paragraph>
        You are onboarding <strong>{project?.name || '...'}</strong> project,
        running workflow "{workflowName}" (execution ID: {executionId})
      </Typography>

      <Box className={styles.detailContainer}>
        {allTasks.length > 0 ? (
          <WorkFlowStepper tasks={allTasks} setSelectedTask={setSelectedTask} />
        ) : (
          <Progress />
        )}
        <div className={styles.viewerContainer}>
          {log !== '' && <WorkFlowLogViewer log={log} />}
        </div>
      </Box>
    </ParodosPage>
  );
};
