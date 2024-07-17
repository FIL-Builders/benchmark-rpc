import styles from '../styles/Grid.module.css';

const Grid = ({ data }) => {
  const getColorClass = (time) => {
    if (time > 500) {
      return 'has-background-danger has-text-light';
    } else if (time > 200) {
      return 'has-background-warning has-text-dark';
    } else if (time <= 200) {
      return 'has-background-success has-text-light';
    } else {
      return '';
    }
  };

  const calculateAverage = (times) => {
    if (times.length === 0) return 'N/A';
    const total = times.reduce((acc, time) => acc + time, 0);
    return (total / times.length).toFixed(2);
  };

  const calculateMedian = (times) => {
    if (times.length === 0) return 'N/A';
    times.sort((a, b) => a - b);
    const mid = Math.floor(times.length / 2);
    return times.length % 2 !== 0 ? times[mid].toFixed(2) : ((times[mid - 1] + times[mid]) / 2).toFixed(2);
  };

  const getMethodTimes = (methodIndex) => {
    return data
      .map(result => result.responses[methodIndex])
      .filter(response => !response.error)
      .map(response => response.time);
  };

  const getAllTimes = () => {
    return data
      .flatMap(result => result.responses)
      .filter(response => !response.error)
      .map(response => response.time);
  };

  const averageOfAverages = calculateAverage(
    data
      .map(result => result.responses)
      .flat()
      .filter(response => !response.error)
      .map(response => response.time)
  );

  const medianOfMedians = calculateMedian(
    data
      .map(result => result.responses)
      .flat()
      .filter(response => !response.error)
      .map(response => response.time)
  );

  return (
    <div className={styles.tableContainer}>
      <div className={styles.legend}>
        <span className="tag is-success">≤ 200 ms</span>
        <span className="tag is-warning">201 - 500 ms</span>
        <span className="tag is-danger"> &gt; 500 ms</span>
      </div>
      <table
        className={`table is-fullwidth is-striped is-hoverable ${styles.borderedTable}`}
      >
        <thead>
          <tr>
            <th
              style={{ borderRight: "1px solid #ccc" }}
            >
              Method
            </th>
            {data.map((result, index) => (
              <th
                className={`${styles.tableHeader} ${styles.rpcUrl}`}
                key={index}
                style={{ borderRight: "1px solid #ccc" }}
              >
                {result.rpcUrl}
              </th>
            ))}
            <th
              style={{ borderRight: "1px solid #ccc" }}
            >
              Average
            </th>
            <th
              style={{ borderRight: "1px solid #ccc" }}
            >
              Median
            </th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 &&
            data[0].responses.map((response, index) => {
              const methodTimes = getMethodTimes(index);
              const methodAverage = calculateAverage(methodTimes);
              const methodMedian = calculateMedian(methodTimes);

              return (
                <tr key={index}>
                  <td>{response.method}</td>
                  {data.map((result, i) => (
                    <td
                      key={i}
                      className={getColorClass(result.responses[index].time)}
                    >
                      {result.responses[index].error
                        ? `❌ ${result.responses[index].errorMessage}`
                        : `${result.responses[index].time.toFixed(2)} ms`}
                    </td>
                  ))}
                  <td className={getColorClass(methodAverage)}>
                    {`${methodAverage}`} ms
                  </td>
                  <td className={getColorClass(methodMedian)}>
                    {`${methodMedian}`} ms
                  </td>
                </tr>
              );
            })}
          {data.length > 0 && (
            <>
              <tr>
                <td>Summary Average</td>
                {data.map((result, index) => {
                  const times = result.responses
                    .filter((response) => !response.error)
                    .map((response) => response.time);
                  const average = calculateAverage(times);
                  return (
                    <td key={index} className={getColorClass(average)}>
                      {average} ms
                    </td>
                  );
                })}
                <td colSpan="2" className={getColorClass(averageOfAverages)}>
                  {averageOfAverages} ms
                </td>
              </tr>
              <tr>
                <td style={{ borderBottom: '1px solid' }}>Summary Median</td>
                {data.map((result, index) => {
                  const times = result.responses
                    .filter((response) => !response.error)
                    .map((response) => response.time);
                  const median = calculateMedian(times);
                  return (
                    <td key={index} className={getColorClass(median)}>
                      {median} ms
                    </td>
                  );
                })}
                <td colSpan="2" className={getColorClass(medianOfMedians)}>
                  {medianOfMedians} ms
                </td>
              </tr>
            </>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Grid;


