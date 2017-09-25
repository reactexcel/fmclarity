const cron = {
  complete_booking_request_checks: {
    enabled: process.env.FMC_COMPLETE_BOOKING_REQUEST_CHECKS || false
  }
};
export default cron;