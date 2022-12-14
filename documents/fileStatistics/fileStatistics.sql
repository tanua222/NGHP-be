SELECT
    *
FROM 
  ( SELECT
    row_number() over
(
ORDER BY clec_filename desc
      ) rn, 
      COUNT(*) OVER () as result_count, 
      x.* 
        FROM
            (
                SELECT
                    y.*,
                    ( y.awaiting_ack_accepted + y.awaiting_ack_rejected ) AS total_processed
                FROM
                    (
                        SELECT
                            blif_file.clec_filename,
                            blif_file.edi_filename,
                            blif_file.dt_downloaded,
                            to_char(from_tz(CAST(blif_file.dt_downloaded AS TIMESTAMP), dbtimezone) AT TIME ZONE to_char('PST'),
                                    'yyyy-mm-dd HH24:MI:SS')                                     AS dt_downloaded_pst_fmt,
                            blif_spid.name,
                            blif_file.clec_prov,
                            SUM(decode(blif_listings.internal_status, '0000', 1, 0)) AS new,
                            SUM(
                                CASE blif_listings.internal_status
                                    WHEN '0001' THEN
                                        decode(blif_listings.act_ind, 'A', 1, 'I', 2,
                                               0)
                                    ELSE
                                        0
                                END
                            )                                                                    AS awaiting_precheck,
                            SUM(decode(blif_listings.internal_status, '0002', 1, 0)) AS awaiting_blif_to_direction,
                            SUM(decode(blif_listings.internal_status, '0010', 1, 0)) AS locked_by_automation,
                            SUM(decode(blif_listings.internal_status, '0015', 1, 0)) AS failed_blif_to_direction,
                            SUM(decode(blif_listings.internal_status, '0032', 1, 0)) AS awaiting_ack_accepted,
                            SUM(decode(blif_listings.internal_status, '0031', 1, 0)) AS awaiting_ack_rejected,
                            SUM(1)                                                              AS total_received
                        FROM
                                 blif_file
                            INNER JOIN blif_file_exch ON blif_file.blif_file_id = blif_file_exch.blif_file_id
                            INNER JOIN blif_listings ON blif_listings.blif_file_exch_id = blif_file_exch.blif_file_exch_id left outer
JOIN blif_spid ON blif_file.clec_spid = blif_spid.spid
WHERE
        file_status = '1'
    AND telus_ind = 'N'
GROUP BY
    clec_filename,
    edi_filename,
    dt_downloaded,
    blif_spid.name,
    blif_file.clec_prov
                    ) y
WHERE
    ( y.new + y.awaiting_precheck + y.awaiting_blif_to_direction + y.locked_by_automation + y.failed_blif_to_direction + y.awaiting_ack_accepted +
    y.awaiting_ack_rejected ) >= 0
            ) x )
WHERE
    rn BETWEEN 0 AND 100
ORDER by rn