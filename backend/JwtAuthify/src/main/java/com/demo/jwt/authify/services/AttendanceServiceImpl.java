package com.demo.jwt.authify.services;

import com.demo.jwt.authify.entity.StudentAttendanceEntity;
import com.demo.jwt.authify.entity.StudentEntity;
import com.demo.jwt.authify.entity.TeacherAttendanceEntity;
import com.demo.jwt.authify.entity.TeacherEntity;
import com.demo.jwt.authify.io.AttendancePercentageResponse;
import com.demo.jwt.authify.io.StudentAttendanceRequest;
import com.demo.jwt.authify.io.TeacherAttendanceRequest;
import com.demo.jwt.authify.repository.StudentAttendanceRepository;
import com.demo.jwt.authify.repository.StudentRepository;
import com.demo.jwt.authify.repository.TeacherAttendanceRepository;
import com.demo.jwt.authify.repository.TeacherRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(rollbackFor = Exception.class)
public class AttendanceServiceImpl implements AttendanceService {

    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final StudentAttendanceRepository studentAttendanceRepository;
    private final TeacherAttendanceRepository teacherAttendanceRepository;
    @PersistenceContext
    private final EntityManager entityManager;

    @Override
    public Boolean markStudentAttendance(StudentAttendanceRequest request) {
        List<StudentEntity> allStudents = studentRepository.findByStudentClassAndSection(
                request.getStudentClass(), request.getSection()
        );
        if(!allStudents.isEmpty()) {
            List<StudentAttendanceEntity> existingAttendanceList = studentAttendanceRepository
                    .findByAttendanceDateAndStudent_StudentClassAndStudent_Section(
                            request.getAttendanceDate(),
                            request.getStudentClass(),
                            request.getSection()
                    );
            Map<Long, StudentAttendanceEntity> existingAttendanceMap = existingAttendanceList.stream()
                    .collect(Collectors.toMap(
                            att -> att.getStudent().getAdmissionId(),
                            att -> att
                    ));
            Set<Long> markedStudentIds = request.getStudents()
                    .stream()
                    .map(StudentAttendanceRequest.StudentAttendance::getStudentId)
                    .collect(Collectors.toSet());
            List<StudentAttendanceEntity> toUpdate = new ArrayList<>();
            List<StudentAttendanceEntity> toInsert = new ArrayList<>();

            for (StudentEntity student : allStudents) {
                boolean isMarked = markedStudentIds.contains(student.getAdmissionId());
                String status = determineStatus(request.getMarkingMode(), isMarked);

                if (existingAttendanceMap.containsKey(student.getAdmissionId())) {
                    StudentAttendanceEntity existing = existingAttendanceMap.get(student.getAdmissionId());
                    existing.setStatus(status);
                    toUpdate.add(existing);
                } else {
                    StudentAttendanceEntity newAttendance = StudentAttendanceEntity.builder()
                            .student(student)
                            .attendanceDate(request.getAttendanceDate())
                            .status(status)
                            .build();
                    toInsert.add(newAttendance);
                }
            }
            if (!toUpdate.isEmpty()) {
                studentAttendanceRepository.saveAll(toUpdate);
                return true;
            }
            if (!toInsert.isEmpty()) {
                studentAttendanceRepository.saveAll(toInsert);
                return true;
            }
        }
        return false;
    }

    @Override
    public Boolean markTeacherAttendance(TeacherAttendanceRequest request) {
        List<TeacherEntity> allTeachers = teacherRepository.findAll();

        List<TeacherAttendanceEntity> existingAttendanceList = teacherAttendanceRepository
                .findByAttendanceDate(request.getAttendanceDate());

        Map<Long, TeacherAttendanceEntity> existingAttendanceMap = existingAttendanceList.stream()
                .collect(Collectors.toMap(
                        att -> att.getTeacher().getTeacherId(),
                        att -> att
                ));

        Set<Long> markedTeacherIds = request.getTeachers()
                .stream()
                .map(TeacherAttendanceRequest.TeacherAttendance::getTeacherId)
                .collect(Collectors.toSet());

        List<TeacherAttendanceEntity> toUpdate = new ArrayList<>();
        List<TeacherAttendanceEntity> toInsert = new ArrayList<>();

        for (TeacherEntity teacher : allTeachers) {
            boolean isMarked = markedTeacherIds.contains(teacher.getTeacherId());
            String status = determineStatus(request.getMarkingMode(), isMarked);

            if (existingAttendanceMap.containsKey(teacher.getTeacherId())) {
                TeacherAttendanceEntity existing = existingAttendanceMap.get(teacher.getTeacherId());
                existing.setStatus(status);
                toUpdate.add(existing);
            } else {
                TeacherAttendanceEntity newAttendance = TeacherAttendanceEntity.builder()
                        .teacher(teacher)
                        .attendanceDate(request.getAttendanceDate())
                        .status(status)
                        .build();
                toInsert.add(newAttendance);
            }
        }
        if (!toUpdate.isEmpty()) {
            teacherAttendanceRepository.saveAll(toUpdate);
            return true;
        }
        if (!toInsert.isEmpty()) {
            teacherAttendanceRepository.saveAll(toInsert);
            return true;
        }
        return false;
    }

    @Override
    public Page<StudentAttendanceEntity> getAllStudentAttendances(
            int page,
            int size,
            Integer studentClass,
            String section,
            LocalDate attendanceDate,
            String name) {

        CriteriaBuilder cb = entityManager.getCriteriaBuilder();

        CriteriaQuery<StudentAttendanceEntity> query = cb.createQuery(StudentAttendanceEntity.class);
        Root<StudentAttendanceEntity> attendance = query.from(StudentAttendanceEntity.class);

        Join<StudentAttendanceEntity, StudentEntity> studentJoin = attendance.join("student", JoinType.INNER);

        List<Predicate> predicates = new ArrayList<>();
        predicates.add(cb.equal(studentJoin.get("studentClass"), studentClass));
        predicates.add(cb.equal(studentJoin.get("section"), section));
        predicates.add(cb.equal(attendance.get("attendanceDate"), attendanceDate));

        if (name != null && !name.isBlank()) {
            predicates.add(cb.like(
                    cb.lower(studentJoin.get("name")),
                    "%" + name.toLowerCase() + "%"
            ));
        }
        query.where(cb.and(predicates.toArray(new Predicate[0])));

        List<StudentAttendanceEntity> resultList = entityManager.createQuery(query)
                .setFirstResult(page * size)
                .setMaxResults(size)
                .getResultList();

        CriteriaQuery<Long> countQuery = cb.createQuery(Long.class);
        Root<StudentAttendanceEntity> countRoot = countQuery.from(StudentAttendanceEntity.class);

        Join<StudentAttendanceEntity, StudentEntity> countStudentJoin = countRoot.join("student", JoinType.INNER);

        List<Predicate> countPredicates = new ArrayList<>();
        countPredicates.add(cb.equal(countStudentJoin.get("studentClass"), studentClass));
        countPredicates.add(cb.equal(countStudentJoin.get("section"), section));
        countPredicates.add(cb.equal(countRoot.get("attendanceDate"), attendanceDate));

        if (name != null && !name.isBlank()) {
            countPredicates.add(cb.like(
                    cb.lower(countStudentJoin.get("name")),
                    "%" + name.toLowerCase() + "%"
            ));
        }

        countQuery.select(cb.count(countRoot));
        countQuery.where(cb.and(countPredicates.toArray(new Predicate[0])));

        Long totalRecords = entityManager.createQuery(countQuery).getSingleResult();
        if (totalRecords == 0) {
            return Page.empty();
        }

        return new PageImpl<>(resultList, PageRequest.of(page, size), totalRecords);
    }

    @Override
    public Page<TeacherAttendanceEntity> getAllTeacherAttendances(
            int page,
            int size,
            LocalDate attendanceDate,
            String name) {

        CriteriaBuilder cb = entityManager.getCriteriaBuilder();

        CriteriaQuery<TeacherAttendanceEntity> query = cb.createQuery(TeacherAttendanceEntity.class);
        Root<TeacherAttendanceEntity> attendance = query.from(TeacherAttendanceEntity.class);

        Join<TeacherAttendanceEntity, TeacherEntity> teacherJoin = attendance.join("teacher", JoinType.INNER);

        List<Predicate> predicates = new ArrayList<>();

        if (attendanceDate != null) {
            predicates.add(cb.equal(attendance.get("attendanceDate"), attendanceDate));
        }

        if (name != null && !name.isBlank()) {
            predicates.add(cb.like(
                    cb.lower(teacherJoin.get("name")),
                    "%" + name.toLowerCase() + "%"
            ));
        }

        query.where(cb.and(predicates.toArray(new Predicate[0])));

        List<TeacherAttendanceEntity> resultList = entityManager.createQuery(query)
                .setFirstResult(page * size)
                .setMaxResults(size)
                .getResultList();

        CriteriaQuery<Long> countQuery = cb.createQuery(Long.class);
        Root<TeacherAttendanceEntity> countRoot = countQuery.from(TeacherAttendanceEntity.class);

        Join<TeacherAttendanceEntity, TeacherEntity> countTeacherJoin = countRoot.join("teacher", JoinType.INNER);

        List<Predicate> countPredicates = new ArrayList<>();

        if (attendanceDate != null) {
            countPredicates.add(cb.equal(countRoot.get("attendanceDate"), attendanceDate));
        }

        if (name != null && !name.isBlank()) {
            countPredicates.add(cb.like(
                    cb.lower(countTeacherJoin.get("name")),
                    "%" + name.toLowerCase() + "%"
            ));
        }

        countQuery.select(cb.count(countRoot));
        countQuery.where(cb.and(countPredicates.toArray(new Predicate[0])));

        Long totalRecords = entityManager.createQuery(countQuery).getSingleResult();
        if (totalRecords == 0) {
            return Page.empty();
        }
        return new PageImpl<>(resultList, PageRequest.of(page, size), totalRecords);
    }

    public List<AttendancePercentageResponse> calculateAttendancePercentages(Integer year) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();

        // Query for student attendance
        CriteriaQuery<StudentAttendanceEntity> studentQuery = cb.createQuery(StudentAttendanceEntity.class);
        Root<StudentAttendanceEntity> studentRoot = studentQuery.from(StudentAttendanceEntity.class);

        List<Predicate> studentPredicates = new ArrayList<>();
        if (year != null) {
            studentPredicates.add(cb.equal(
                    cb.function("YEAR", Integer.class, studentRoot.get("attendanceDate")),
                    year
            ));
        }

        studentQuery.select(studentRoot).where(cb.and(studentPredicates.toArray(new Predicate[0])));
        List<StudentAttendanceEntity> studentAttendance = entityManager.createQuery(studentQuery).getResultList();

        CriteriaQuery<TeacherAttendanceEntity> teacherQuery = cb.createQuery(TeacherAttendanceEntity.class);
        Root<TeacherAttendanceEntity> teacherRoot = teacherQuery.from(TeacherAttendanceEntity.class);

        List<Predicate> teacherPredicates = new ArrayList<>();
        if (year != null) {
            teacherPredicates.add(cb.equal(
                    cb.function("YEAR", Integer.class, teacherRoot.get("attendanceDate")),
                    year
            ));
        }

        teacherQuery.select(teacherRoot).where(cb.and(teacherPredicates.toArray(new Predicate[0])));
        List<TeacherAttendanceEntity> teacherAttendance = entityManager.createQuery(teacherQuery).getResultList();

        return calculatePercentages(studentAttendance, teacherAttendance);
    }

    private List<AttendancePercentageResponse> calculatePercentages(
            List<StudentAttendanceEntity> studentAttendance,
            List<TeacherAttendanceEntity> teacherAttendance) {

        List<AttendancePercentageResponse> attendancePercentageResponses = new ArrayList<>();

        for (int month = 1; month <= 12; month++) {
            final int currentMonth = month;
            long studentPresent = studentAttendance.stream()
                    .filter(a -> a.getAttendanceDate().getMonthValue() == currentMonth && "PRESENT".equalsIgnoreCase(a.getStatus()))
                    .count();

            long studentAbsent = studentAttendance.stream()
                    .filter(a -> a.getAttendanceDate().getMonthValue() == currentMonth && "ABSENT".equalsIgnoreCase(a.getStatus()))
                    .count();

            long studentTotal = studentPresent + studentAbsent;
            double studentPresentPercent = studentTotal == 0 ? 0 : (studentPresent * 100.0) / studentTotal;
            double studentAbsentPercent = 100.0 - studentPresentPercent;

            long teacherPresent = teacherAttendance.stream()
                    .filter(a -> a.getAttendanceDate().getMonthValue() == currentMonth && "PRESENT".equalsIgnoreCase(a.getStatus()))
                    .count();

            long teacherAbsent = teacherAttendance.stream()
                    .filter(a -> a.getAttendanceDate().getMonthValue() == currentMonth && "ABSENT".equalsIgnoreCase(a.getStatus()))
                    .count();

            long teacherTotal = teacherPresent + teacherAbsent;
            double teacherPresentPercent = teacherTotal == 0 ? 0 : (teacherPresent * 100.0) / teacherTotal;
            double teacherAbsentPercent = 100.0 - teacherPresentPercent;

            attendancePercentageResponses.add(new AttendancePercentageResponse(
                    currentMonth,
                    studentPresentPercent,
                    studentAbsentPercent,
                    teacherPresentPercent,
                    teacherAbsentPercent
            ));
        }
        return attendancePercentageResponses;
    }

    private String determineStatus(String markingMode, boolean isMarked) {
        if ("present".equalsIgnoreCase(markingMode)) {
            return isMarked ? "PRESENT" : "ABSENT";
        } else if ("absent".equalsIgnoreCase(markingMode)) {
            return isMarked ? "ABSENT" : "PRESENT";
        } else {
            throw new IllegalArgumentException("Invalid marking mode: " + markingMode);
        }
    }
}
