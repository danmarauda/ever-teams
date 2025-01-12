/* eslint-disable camelcase */
import moment from 'moment-timezone';
import { OT_Member } from '../services/interfaces/IOrganizationTeam';
import { ITimerStatus } from '../services/interfaces/ITimer';

type timerStatusReturnValue = 'pause' | 'running' | 'idle' | 'online' | 'suspended';

export const getTimerStatusValue = (
	timerStatus: ITimerStatus | null,
	member: OT_Member,

	publicTeam?: boolean
): timerStatusReturnValue => {
	return !member?.employee?.isActive && !publicTeam
		? 'suspended'
		: member?.employee?.isOnline
		? //  && member?.timerStatus !== 'running'
		  'online'
		: !timerStatus?.running &&
		  timerStatus?.lastLog &&
		  timerStatus?.lastLog?.startedAt &&
		  timerStatus?.lastLog?.employeeId === member?.employeeId &&
		  moment().diff(moment(timerStatus?.lastLog?.startedAt), 'hours') < 24 &&
		  timerStatus?.lastLog?.source !== 'MOBILE'
		? 'pause'
		: member?.timerStatus === 'pause'
		? 'pause'
		: !member?.totalTodayTasks?.length
		? 'idle'
		: member?.timerStatus || 'idle';
};
